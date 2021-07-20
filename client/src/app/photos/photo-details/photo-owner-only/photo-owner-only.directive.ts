import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

import { Photo } from '../../photo/photo';
import { UserService } from './../../../core/user/user.service';

@Directive({
    selector: '[photoOwnerOnly]'
})
export class PhotoOwnerOnlyDirective implements OnInit {

    @Input() ownedPhoto: Photo;
    @Input() nodePai;

    constructor(
        private element: ElementRef<any>,
        private renderer: Renderer2,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        // SOLUÇÃO DA AULA:
        this.userService
            .getUser()
            .subscribe(user => {
                if (!user || user.id !== this.ownedPhoto.userId) {
                    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
                }
            });

        // SOLUÇÃO OTIMIZADA:
        // this.userService
        //     .getUser()
        //     .subscribe(user => {
        //         if (!user || user.id !== this.ownedPhoto.userId) {
        //             this.renderer.removeChild(this.nodePai, this.element.nativeElement);
        //         }
        //     });
    }

}
