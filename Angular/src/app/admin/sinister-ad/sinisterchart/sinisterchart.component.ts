import { Component, OnInit } from '@angular/core';
import { SinistersService } from 'src/app/services/sinisters.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sinisterchart',
  templateUrl: './sinisterchart.component.html',
  styleUrls: ['./sinisterchart.component.css']
})
export class SinisterchartComponent implements OnInit {
  currentUser: any = null;

  constructor(private sinisterService: SinistersService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadChartData();
  }

  loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        console.log('🔐 Current user loaded:', this.currentUser);
      } catch (e) {
        console.error('❌ Failed to parse currentUser from localStorage:', e);
      }
    }
  }

  loadChartData(): void {
    this.sinisterService.getStatusCountByDate().subscribe((data) => {
      const labels = Object.keys(data);
      const acceptedCounts = labels.map(date => data[date]['ACCEPTED'] || 0);
      const declinedCounts = labels.map(date => data[date]['DECLINED'] || 0);

      const totalAccepted = acceptedCounts.reduce((sum, count) => sum + count, 0);
      const totalDeclined = declinedCounts.reduce((sum, count) => sum + count, 0);

      const chartConfig: ChartConfiguration = {
        type: 'pie',
        data: {
          labels: ['Accepted', 'Declined'],
          datasets: [{
            label: 'Status Counts',
            data: [totalAccepted, totalDeclined],
            backgroundColor: ['green', 'red'],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Sinister Status Distribution'
            }
          }
        }
      };

      console.log('📊 Chart Data:', data);
      console.log('✅ Total Accepted:', totalAccepted);
      console.log('❌ Total Declined:', totalDeclined);

      new Chart('sinisterChart', chartConfig);
    });
  }
}
