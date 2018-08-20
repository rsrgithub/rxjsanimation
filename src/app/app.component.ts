import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Scheduler, animationFrameScheduler, defer, interval } from 'rxjs';
import {map, takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('circle') _circle: ElementRef;

  constructor(private _renderer2: Renderer2) {

  }

  ngAfterViewInit() {

    const msElapsed = (scheduler = animationFrameScheduler) => {

      return defer(() => {

        const start = scheduler.now();

        return interval(0, scheduler)
        .pipe(
          map(x => {
            return scheduler.now() - start;
          })
        );

      });
    };

    const pixelsPerSecond = (v) => (ms) => v * ms / 1000;

    const byVelocity = msElapsed()
    .pipe(
      takeWhile(x => x <= 2000),
      map(
        pixelsPerSecond(500)
      )
    );

    // byVelocity.subscribe(frames => {
    //   this._renderer2.setStyle(this._circle.nativeElement, 'transform', `translate3d(0, ${frames}px, 0)`);
    // });

    const duration = (ms, scheduler = animationFrameScheduler) => {

      return msElapsed(scheduler)
      .pipe(
        map(ems => ems / ms),
        takeWhile(t => {

          console.log(t);
          return t <= 1;
        })
      );
    };

    const distance = (d) => (t) => t * d;

    const byDuration = duration(2000)
                       .pipe(
                         map(distance(300))
                       );

    byDuration.subscribe(frames => {
      this._renderer2.setStyle(this._circle.nativeElement, 'transform', `translate3d(0, ${frames}px, 0)`);
    });

  }
}
