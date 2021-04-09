import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import s from 'underscore.string';
import toastr from 'toastr'; // 201020 nick userPopup 新增複製已成功提示

Meteor.startup(() => {
	let currentGallery = null;

	// 200930 nick test
	const keyDown = async (event) => {
		if (event.key === 'c' && event.ctrlKey) {
			const currentImageSrc = currentGallery.currItem.src;

			const	img = new Image();
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			img.onload = function() {
				canvas.width = this.naturalWidth;
				canvas.height = this.naturalHeight;
				ctx.drawImage(this, 0, 0);
				canvas.toBlob((blob) => {
					const data = [new ClipboardItem({ 'image/png': blob })];
					navigator.clipboard.write(data);
					toastr.success('已複製成功'); // 201020 nick userPopup 新增複製已成功提示
				}, 'image/png');
			};
			img.src = currentImageSrc;
		}
	};

	const initGallery = async (items, options) => {
		Blaze.render(Template.photoswipeContent, document.body);
		const [PhotoSwipeImport, PhotoSwipeUI_DefaultImport] = await Promise.all([import('photoswipe'), import('photoswipe/dist/photoswipe-ui-default'), import('photoswipe/dist/photoswipe.css')]);
		if (!currentGallery) {
			const PhotoSwipe = PhotoSwipeImport.default;
			const PhotoSwipeUI_Default = PhotoSwipeUI_DefaultImport.default;
			currentGallery = await new PhotoSwipe(document.getElementById('pswp'), PhotoSwipeUI_Default, items, options);
			currentGallery.listen('destroy', () => {
				window.removeEventListener('keyup', keyDown); // 200930 nick test
				currentGallery = null;
			});
			currentGallery.init();
			window.addEventListener('keyup', keyDown); // 200930 nick test
		}
	};

	const defaultGalleryOptions = {
		bgOpacity: 0.8,
		showHideOpacity: true,
		counterEl: false,
		shareEl: false,
	};

	const createEventListenerFor = (className) => (event) => {
		event.preventDefault();
		event.stopPropagation();

		if (currentGallery) {
			return;
		}

		const galleryOptions = {
			...defaultGalleryOptions,
			index: 0,
			addCaptionHTMLFn(item, captionEl) {
				captionEl.children[0].innerHTML =					`${ s.escapeHTML(item.title) }<br/><small>${ s.escapeHTML(item.description) }</small>`;
				return true;
			},
		};

		const items = Array.from(document.querySelectorAll(className))
			.map((element, i) => {
				if (element === event.currentTarget) {
					galleryOptions.index = i;
				}

				if (element.dataset.src || element.href) {
					const img = new Image();

					img.addEventListener('load', () => {
						if (!currentGallery) {
							return;
						}

						delete currentGallery.items[i].html;
						currentGallery.items[i].src = img.src;
						currentGallery.items[i].w = img.naturalWidth;
						currentGallery.items[i].h = img.naturalHeight;
						currentGallery.invalidateCurrItems();
						currentGallery.updateSize(true);
					});

					img.src = element.dataset.src || element.href;

					return {
						html: '',
						title: element.dataset.title || element.title,
						description: element.dataset.description,
					};
				}

				return {
					src: element.src,
					w: element.naturalWidth,
					h: element.naturalHeight,
					title: element.dataset.title || element.title,
					description: element.dataset.description,
				};
			});

		initGallery(items, galleryOptions);
	};

	$(document).on('click', '.gallery-item', createEventListenerFor('.gallery-item'));
});
