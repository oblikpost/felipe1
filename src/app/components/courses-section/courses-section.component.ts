import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-courses-section',
  templateUrl: './courses-section.component.html',
  styleUrls: ['./courses-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoursesSectionComponent implements AfterViewInit {
  constructor(private navCtrl: NavController) {}

  ngAfterViewInit() {
    const sliderWrapper = document.getElementById('slider-wrapper')!;
    const arrowLeft = document.getElementById('arrow-left')!;
    const arrowRight = document.getElementById('arrow-right')!;
    const courseCards = document.querySelectorAll('.course-card');

    const scrollSlider = (direction: number) => {
      const card = document.querySelector('.course-card') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth || 250;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * direction;

      sliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const maxScrollLeft =
          sliderWrapper.scrollWidth - sliderWrapper.clientWidth;

        if (sliderWrapper.scrollLeft >= maxScrollLeft - 5 && direction > 0) {
          sliderWrapper.scrollTo({ left: 0, behavior: 'smooth' });
        }
        if (sliderWrapper.scrollLeft <= 0 && direction < 0) {
          sliderWrapper.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        }
      }, 400);
    };

    arrowLeft.addEventListener('click', () => scrollSlider(-1));
    arrowRight.addEventListener('click', () => scrollSlider(1));

    courseCards.forEach((card) => {
      card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) {
          this.navCtrl.navigateForward(url);
        }
      });
    });
  }
}
