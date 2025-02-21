import { defaultFormatParsers, getFormatParsers } from '../../formatHandlers/defaultFormatHandlers';
import { defaultProcessorMap } from './defaultProcessors';
import { defaultStyleMap } from '../../formatHandlers/utils/defaultStyles';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { DomToModelOption } from '../../publicTypes/IExperimentalContentModelEditor';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    options?: DomToModelOption
): DomToModelContext {
    const context: DomToModelContext = {
        ...(editorContext || {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
            getDarkColor: undefined,
        }),

        blockFormat: {},
        segmentFormat: {},
        isInSelection: false,

        listFormat: {
            levels: [],
            threadItemCounts: [],
        },
        link: {
            format: {},
            dataset: {},
        },

        elementProcessors: {
            ...defaultProcessorMap,
            ...(options?.processorOverride || {}),
        },

        defaultStyles: {
            ...defaultStyleMap,
            ...(options?.defaultStyleOverride || {}),
        },

        formatParsers: getFormatParsers(
            options?.formatParserOverride,
            options?.additionalFormatParsers
        ),

        defaultElementProcessors: defaultProcessorMap,
        defaultFormatParsers: defaultFormatParsers,
    };

    if (editorContext?.isRightToLeft) {
        context.blockFormat.direction = 'rtl';
    }

    if (options?.alwaysNormalizeTable) {
        context.alwaysNormalizeTable = true;
    }

    const range = options?.selectionRange;

    switch (range?.type) {
        case SelectionRangeTypes.Normal:
            const regularRange = range.ranges[0];
            if (regularRange) {
                context.regularSelection = {
                    startContainer: regularRange.startContainer,
                    startOffset: regularRange.startOffset,
                    endContainer: regularRange.endContainer,
                    endOffset: regularRange.endOffset,
                    isSelectionCollapsed: regularRange.collapsed,
                };
            }
            break;

        case SelectionRangeTypes.TableSelection:
            if (range.coordinates && range.table) {
                context.tableSelection = {
                    table: range.table,
                    firstCell: { ...range.coordinates.firstCell },
                    lastCell: { ...range.coordinates.lastCell },
                };
            }

            break;

        case SelectionRangeTypes.ImageSelection:
            context.imageSelection = {
                image: range.image,
            };
            break;
    }

    return context;
}
