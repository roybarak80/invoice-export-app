import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signature-pad">
      <canvas
        #canvas
        (mousedown)="startDrawing($event)"
        (mousemove)="draw($event)"
        (mouseup)="stopDrawing()"
        (mouseleave)="stopDrawing()"
        (touchstart)="startDrawing($event)"
        (touchmove)="draw($event)"
        (touchend)="stopDrawing()"
      ></canvas>
    </div>
  `,
  styles: [`
    .signature-pad {
      border: 1px solid #ccc;
      position: relative;
      width: 100%;
    }
    canvas {
      width: 100%;
      height: 150px;
      touch-action: none;
    }
    button {
      margin-top: 8px;
    }
  `]
})
export class SignaturePadComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureProvided = new EventEmitter<boolean>();

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private isSigned = false;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.drawing = true;
    const pos = this.getPosition(event);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.drawing) return;
    const pos = this.getPosition(event);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    if (!this.isSigned) {
      this.isSigned = true;
      this.signatureProvided.emit(true);
    }
  }

  stopDrawing() {
    this.drawing = false;
    this.ctx.closePath();
  }

  clear() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.isSigned = false;
    this.signatureProvided.emit(false);
  }

  getSignatureImage(): string {
    return this.canvasRef.nativeElement.toDataURL('image/png');
  }

  private getPosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  }
}
