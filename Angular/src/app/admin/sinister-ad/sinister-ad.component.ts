import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from 'src/app/services/user.service';
Chart.register(...registerables);

@Component({
  selector: 'app-sinister-ad',
  templateUrl: './sinister-ad.component.html',
  styleUrls: ['./sinister-ad.component.css']
})
export class SinisterADComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sinisterTable', { static: false }) table!: ElementRef;
  timeSpentData: { [key: number]: { [status: string]: string } } = {};
  sinisters: Sinister[] = [];
  filteredSinisters: Sinister[] = [];
  totalSinisters: number = 0;
  totalAccepted: number = 0;
  totalDeclined: number = 0;
  totalPending: number = 0;
  searchTerm: string = '';
  pageSize: number = 10;
  pageIndex: number = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  dataTable: any;
  hideAcceptedDeclined: boolean = false; // Toggle state
  usernames: { [key: string]: string } = {};
 userr: any;
  constructor(
    private sinistersService: SinistersService, 
    public userService: UserService,   // Make sure to import UserService appropriately
    private router: Router
  ) {}

  userId: number | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userId = decodedToken?.id || null;
      console.log('Logged in as userId:', this.userId);
    }
  }
  decodeToken(token: string): any {
    try {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  ngAfterViewInit() {
    this.loadSinisters();
  }

  private loadSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
  
        this.sinisters.forEach(sinister => {
          this.userService.getUser(sinister.user).subscribe({
            next: (userData) => {
              const fullName = userData.firstName + ' ' + userData.lastName;
              this.usernames[sinister.user] = fullName;
            },
            error: (error) => {
              console.error('Error fetching user:', error);
              this.usernames[sinister.user] = 'Unknown User'; // fallback
            }
          });
        });
  
        this.applyFilters();
        this.totalSinisters = this.sinisters.length;
        this.totalAccepted = this.sinisters.filter(s => s.status.toUpperCase() === 'ACCEPTED').length;
        this.totalDeclined = this.sinisters.filter(s => s.status.toUpperCase() === 'DECLINED').length;
        this.totalPending = this.sinisters.filter(s => s.status.toUpperCase() === 'PENDING').length;
        this.sinisters.forEach(sinister => {
          this.loadTimeSpentData(sinister.id);
        });
        this.initializePieChart();
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
      }
    });
  }

  private loadTimeSpentData(sinisterId: number): void {
    this.sinistersService.getTimeSpentInEachStatus(sinisterId).subscribe({
      next: (data: { [status: string]: string }) => {
        this.timeSpentData[sinisterId] = data;
      },
      error: (error) => {
        console.error('Error fetching time spent data:', error);
      }
    });
  }

  private applyFilters() {
    let filteredData = this.sinisters;
  
    // Filter out archived sinisters
    filteredData = filteredData.filter(s => s.status.toUpperCase() !== 'ARCHIVED');
  
    // Filter out ACCEPTED and DECLINED sinisters if hideAcceptedDeclined is true
    if (this.hideAcceptedDeclined) {
      filteredData = filteredData.filter(s =>
        s.status.toUpperCase() !== 'ACCEPTED' && s.status.toUpperCase() !== 'DECLINED'
      );
    }
  
    // Apply search filter using the username map
    if (this.searchTerm) {
      const lowerSearch = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(sinister => {
        const username = this.usernames[sinister.user];
        return username && username.toLowerCase().includes(lowerSearch);
      });
    }
  
    this.filteredSinisters = filteredData;
    this.pageIndex = 0;
    this.paginator.firstPage();
  }
  

  toggleHideAcceptedDeclined() {
    this.hideAcceptedDeclined = !this.hideAcceptedDeclined;
    this.applyFilters();
  }

  private initializePieChart() {
    const pieChartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Accepted', 'Declined', 'Pending'],
        datasets: [{
          label: 'Status Counts',
          data: [
            this.hideAcceptedDeclined ? 0 : this.totalAccepted,
            this.hideAcceptedDeclined ? 0 : this.totalDeclined,
            this.totalPending
          ],
          backgroundColor: ['green', 'red', 'orange'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sinister Status Distribution'
          }
        }
      }
    };

    new Chart('sinisterPieChart', pieChartConfig);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredSinisters.sort((a, b) => {
      const valueA = this.getPropertyValue(a, column);
      const valueB = this.getPropertyValue(b, column);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  displaySinister(id: number) {
    this.router.navigate([`/admin/sinister/display`, id]);
  }

  updateSinister(id: number) {
    this.router.navigate([`/admin/sinister/update`, id]);
  }

  deleteSinister(id: number) {
    this.sinistersService.deleteSinister(id).subscribe({
      next: () => {
        this.loadSinisters();
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }

  navigateToArchivedSinisters() {
    this.router.navigate(['/admin/sinister/archived']);
  }

  archiveSinister(id: number) {
    this.sinistersService.toggleArchiveSinister(id).subscribe({
      next: (updatedSinister) => {
        console.log('Archiving sinister with ID:', id);

        const index = this.sinisters.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sinisters[index].status = updatedSinister.status;
        }
        this.loadSinisters();
      },
      error: (error) => {
        console.error('Toggle archive error:', error);
      }
    });
  }

  exportToCSV() {
    const data = this.filteredSinisters.map(sinister => [
      new Date(sinister.dateOfIncident).toLocaleDateString(),
      sinister.description,
      sinister.status,
      sinister.location,
      sinister.typeInsurance,
      new Date(sinister.dateofcreation).toLocaleDateString(),
      this.usernames[sinister.user] || 'N/A'
    ]);
  
    const csvHeader = ['Date of Incident', 'Description', 'Status', 'Location', 'Insurance Type', 'Date of Creation', 'User Name'];
  
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [csvHeader, ...data].map(row => row.join(',')).join('\n');
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sinisters.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    const newTable = document.createElement('table');
    newTable.className = 'table table-striped';

    const headerRow = table.getElementsByTagName('thead')[0].rows[0];
    const newHeaderRow = document.createElement('tr');
    for (let i = 0; i < headerRow.cells.length - 1; i++) {
      const th = document.createElement('th');
      th.textContent = headerRow.cells[i].textContent;
      newHeaderRow.appendChild(th);
    }
    newTable.appendChild(newHeaderRow);

    const tbody = table.getElementsByTagName('tbody')[0];
    const newTbody = document.createElement('tbody');
    for (let i = 0; i < tbody.rows.length; i++) {
      const row = tbody.rows[i];
      const newRow = document.createElement('tr');
      for (let j = 0; j < row.cells.length - 1; j++) {
        const td = document.createElement('td');
        td.textContent = row.cells[j].textContent;
        newRow.appendChild(td);
      }
      newTbody.appendChild(newRow);
    }
    newTable.appendChild(newTbody);

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.appendChild(newTable);
    document.body.appendChild(tempDiv);

    html2canvas(newTable).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('sinisters.pdf');

      document.body.removeChild(tempDiv);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(tempDiv);
    });
  }

  exportToPrint() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    const clonedTable = table.cloneNode(true) as HTMLTableElement;
    const headerRow = clonedTable.getElementsByTagName('thead')[0].rows[0];
    if (headerRow.cells.length > 0) {
      headerRow.deleteCell(headerRow.cells.length - 1);
    }

    const rows = clonedTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      if (cells.length > 0) {
        rows[i].deleteCell(cells.length - 1);
      }
    }

    const printWindow = window.open('', '', 'height=500,width=800');
    if (!printWindow) {
      console.error('Failed to open print window!');
      return;
    }

    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #000; padding: 8px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(clonedTable.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }

  exportToExcel() {
    const data = this.filteredSinisters.map(sinister => [
      new Date(sinister.dateOfIncident).toLocaleDateString(),
      sinister.description,
      sinister.status,
      sinister.location,
      sinister.typeInsurance,
      new Date(sinister.dateofcreation).toLocaleDateString(),
      this.usernames[sinister.user] || 'N/A'
    ]);
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Date of Incident', 'Description', 'Status', 'Location', 'Type Insurance', 'Date of Creation', 'Client Name'],
      ...data
    ]);
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sinisters');
    XLSX.writeFile(wb, 'sinisters.xlsx');
  }
  

  exportToCopy() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    const range = document.createRange();
    range.selectNode(table);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    navigator.clipboard.writeText(table.innerText)
      .then(() => {
        alert('Table copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy table:', err);
        alert('Failed to copy table to clipboard.');
      });

    window.getSelection()?.removeAllRanges();
  }
}
