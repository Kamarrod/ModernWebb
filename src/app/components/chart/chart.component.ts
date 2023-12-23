import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mychart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  public chart: any;
  public usersId: any;
  public countMeetings: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.userService.getStatistic().subscribe({
      next: (response) => {
        this.usersId = response.item1;
        this.countMeetings = response.item2;
        console.log(response);
        this.chart = new Chart('MyChart', {
          type: 'bar',

          data: {
            labels: this.usersId,
            datasets: [
              {
                label: 'Количество посещений мероприятий',
                data: this.countMeetings,
                backgroundColor: 'blue',
              },
            ],
          },

          options: {
            aspectRatio: 2.5,
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
