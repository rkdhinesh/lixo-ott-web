import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
    selector: 'mp-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
    showVideo: boolean = false;
    hideBanner: boolean = true;
    isPlaying: boolean = true;
    previousSlideIndex: number = 0;
    constructor(private renderer: Renderer2) {}
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;
    @ViewChild('videoPlayer') videoPlayer: ElementRef;
    @ViewChildren('videoPlayer') videoPlayers: QueryList<ElementRef>;
    // videoPlayers: HTMLVideoElement[] = [];
    // tslint:disable-next-line: member-ordering
    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: '60px',
        dots: true,
        variableWidth: false,
        variableHeight: false,
        prevArrow: '<img src="/assets/images/img/Left Arrow Button.png" class="slick-prev d-none d-md-none d-lg-block">',
        nextArrow: '<img src="/assets/images/img/Right Arrow Button.png" class="slick-next d-none d-md-none d-lg-block">',
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: true
    };

    slides = [
        {
            img: '/assets/images/img/Main Header 01.png',
            imgMobile:'/assets/images/img/mobile_poster.jpeg',
            video: '/assets/images/img/bg_video.mp4',
            title: 'Lorem Ipsum 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            imdb: '8.8/10',
            hits: 'Streams'
        },
        {
            img: '/assets/images/img/Main Header 01.png',
            imgMobile:'/assets/images/img/mobile_poster.jpeg',
            video: '/assets/images/img/bg_video.mp4',
            title: 'Lorem Ipsum 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            imdb: '8.5/10',
            hits: 'Streams'
        },
        {
            img: '/assets/images/img/Main Header 01.png',
            imgMobile:'/assets/images/img/mobile_poster.jpeg',
            video: '/assets/images/img/bg_video.mp4',
            title: 'Lorem Ipsum 3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            imdb: '9.0/10',
            hits: 'Streams'
        },
        {
            img: '/assets/images/img/Main Header 01.png',
            imgMobile:'/assets/images/img/mobile_poster.jpeg',
            video: '/assets/images/img/bg_video.mp4',
            title: 'Lorem Ipsum 4',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            imdb: '8.7/10',
            hits: 'Streams'
        },
    ];
    ngOnInit(): void {
        // setTimeout(() => {
        //     this.hideBanner = false;
        //     this.showVideo = true;
        // }, 2000)
        // this.hideBanner = false;
        //     this.showVideo = true;
    }

    ngAfterViewInit(): void {
       const videoElement = this.videoPlayer.nativeElement;
       if(videoElement.paused) {
        console.log("true")
        this.isPlaying = true;
       }
       else {
        this.isPlaying =false;
       }
    }

    playPause() {
        const videoElement = this.videoPlayer.nativeElement;
        if(videoElement.paused) {
            videoElement.play();
            this.renderer.setAttribute(videoElement,'muted','true')
            this.isPlaying = false;
           }
           else {
            videoElement.pause();
            this.renderer.setAttribute(videoElement,'muted','true')
            this.isPlaying = true;
           }
    }

    playPauseOption(index: number) {
        console.log("yes");
        const videoElements = this.videoPlayers.toArray();
        const videoElement = videoElements[index].nativeElement as HTMLVideoElement;
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                this.renderer.setAttribute(videoElement,'muted','true')
            this.isPlaying = false;
            } else {
                videoElement.pause();
                this.renderer.setAttribute(videoElement,'muted','true')
            this.isPlaying = true;
            }
        }
    }

    onSlideChange(event: any) {
        const previousVideoElement = this.videoPlayers.toArray()[this.previousSlideIndex].nativeElement as HTMLVideoElement;
        if (previousVideoElement) {
            this.isPlaying = true;
            if (!previousVideoElement.paused || previousVideoElement.currentTime > 0) {
                // Video was playing or partially played, reset and pause
                previousVideoElement.pause();
                previousVideoElement.currentTime = 0;
            } else {
                // Video was not played, set the poster image
                previousVideoElement.poster = this.slides[this.previousSlideIndex].imgMobile;
            }
            // this.renderer.setAttribute(previousVideoElement,'poster', this.slides[this.previousSlideIndex].imgMobile)
            previousVideoElement.load();
        }
    
        const currentVideoElement = this.videoPlayers.toArray()[event.currentSlide].nativeElement as HTMLVideoElement;
        if (currentVideoElement) {
            const videoElement = this.videoPlayer.nativeElement;
            videoElement.poster = this.slides[event.currentSlide].imgMobile;
            if (currentVideoElement.paused) {
                videoElement.poster = this.slides[event.currentSlide].imgMobile;
            } else {
                videoElement.poster = this.slides[event.currentSlide].imgMobile; // Clear poster if video is playing
            }
        }
    
        this.previousSlideIndex = event.currentSlide;
    }
    
    

    muteUnmute() {
        const videoElement = this.videoPlayer.nativeElement;
        if(videoElement.muted) {
            videoElement.muted = false;
           }
           else {
           videoElement.muted = true;
           }
    }
}
