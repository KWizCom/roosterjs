import isContentModelEditor from '../../editor/isContentModelEditor';
import { changeFontSize } from 'roosterjs-content-model';
import { IncreaseFontSizeButtonStringKey, RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSizeButton: RibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            changeFontSize(editor, 'increase');
        }
    },
};
