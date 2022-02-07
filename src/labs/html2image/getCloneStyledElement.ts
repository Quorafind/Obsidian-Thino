// import convertResourceToDataURL from "./convertResourceToDataURL";
// import { dailyNotesService } from '../../services';

import convertResourceToDataURL from './convertResourceToDataURL';

const getCloneStyledElement = async (element: HTMLElement) => {
  const clonedElementContainer = document.createElement(element.tagName);
  // const { vault } = dailyNotesService.getState().app;
  clonedElementContainer.innerHTML = element.innerHTML;

  const applyStyles = async (sourceElement: HTMLElement, clonedElement: HTMLElement) => {
    if (!sourceElement || !clonedElement) {
      return;
    }

    const sourceStyles = window.getComputedStyle(sourceElement);

    if (sourceElement.tagName === 'IMG') {
      try {
        const url = await convertResourceToDataURL(
          sourceElement.getAttribute('path') ?? sourceElement.getAttribute('src'),
        );
        (clonedElement as HTMLImageElement).src = url;
      } catch (error) {
        // do nth
      }
    }else if (sourceElement.className === 'property-image') {
      try {
        const imageUrl = sourceElement.style.backgroundImage
        const url = await convertResourceToDataURL(imageUrl);
        (clonedElement as HTMLImageElement).style.backgroundImage = url;
      }catch (error) {
        // do nth
      }
    }

    for (const item of sourceStyles) {
      clonedElement.style.setProperty(
        item,
        sourceStyles.getPropertyValue(item),
        sourceStyles.getPropertyPriority(item),
      );
    }

    for (let i = 0; i < clonedElement.childElementCount; i++) {
      await applyStyles(sourceElement.children[i] as HTMLElement, clonedElement.children[i] as HTMLElement);
    }
  };

  await applyStyles(element, clonedElementContainer);

  return clonedElementContainer;
};

export default getCloneStyledElement;
