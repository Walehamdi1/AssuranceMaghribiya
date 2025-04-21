import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sinistercal',
  templateUrl: './sinistercal.component.html',
  styleUrls: ['./sinistercal.component.css']
})
export class SinistercalComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  currentUser: any = null;

  constructor(
    private sinistersService: SinistersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    
    this.sinistersService.getPendingSinisters().subscribe((data: Sinister[]) => {
      const events = data
        .filter(s => s.dateofcreation)
        .map(s => {
          const date = new Date(s.dateofcreation);
          if (!isNaN(date.getTime())) {
            return {
              title: `sinister waiting: ${s.id}`,
              start: date.toISOString().split('T')[0],
              color: 'orange',
              id: s.id.toString()
            };
          }
          return undefined;
        })
        .filter((event): event is NonNullable<typeof event> => event !== undefined);

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
      };
    });
  }

  loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
        console.log('✅ Current user loaded:', this.currentUser);
      } catch (e) {
        console.error('❌ Error parsing user from localStorage:', e);
      }
    } else {
      console.warn('⚠️ No currentUser in localStorage');
    }
  }

  handleEventClick(arg: any) {
    const sinisterId = arg.event.id;
    if (sinisterId) {
      this.router.navigate([`/admin/sinister/display/${sinisterId}`]);
    }
  }
}
