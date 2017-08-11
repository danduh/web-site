import {
    AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,
    ViewContainerRef
} from '@angular/core';
import { CanvasService } from "./canvas.service";

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
    @ViewChild('canvasHolder') canvasHolder: ElementRef;
    @ViewChildren('bufferCanvasChars') bufferCanvasChars: QueryList<any>;

    constructor(private canvasService: CanvasService) {
    }

    ngOnInit() {
        // console.log(this.canvasHolder.nativeElement);
    }

    ngAfterViewInit() {
        this.canvasService._init(this.canvasHolder, this.bufferCanvasChars);
    }
}
