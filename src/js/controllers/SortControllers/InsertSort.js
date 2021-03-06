import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class InsertSort extends Sort {
    getType() {
        return 'insertSort';
    }

    instantSort(sizes, sortType) {
        let comparisons = 0;

        for (let i = 1; i < sizes.length; i++) {
            let markedBlock = sizes[i];
            let k = i;
            while (((sizes[k - 1] > markedBlock && !sortType) || (sizes[k - 1] < markedBlock && sortType)) && k > 0) {
                sizes[k] = sizes[k - 1];
                k--;
                comparisons++;
            }
            sizes[k] = markedBlock;
        }

        blocksView.renderBlocks(sizes, this.blockWidth);
        return comparisons;
    }

    makeSteps(sizesOrig, waitTime, sortType = true) {
        this.stepsArr = [];
        this.stepsArr.push({
            stepNum: 'initial settings',
            blocksNum: sizesOrig.length,
        });
        const sizes = [...sizesOrig];

        for (let markedBlock = 1; markedBlock < sizes.length; markedBlock++) {
            const markedBlockHeight = sizes[markedBlock];

            if (markedBlock === 2) {
                this.addStep('colorBlocks', {
                    blocks: [0, 1],
                    color: colors.sorted,
                });
            }

            this.addStep('colorBlocks', {
                blocks: [markedBlock],
                color: colors.chosen,
            });

            this.addStep('raiseBlocks', {
                blocks: [markedBlock],
                waitTime,
            });
            this.addStep('wait', { waitTime });

            let k = markedBlock;

            this.addStep('updtComparisons', {});

            while (
                ((sizes[k - 1] > markedBlockHeight && !sortType) || (sizes[k - 1] < markedBlockHeight && sortType)) &&
                k >= 1
            ) {
                sizes[k] = sizes[k - 1];
                this.addStep('arrSwap', {
                    blocks: [k, k - 1],
                    sizes: sizesOrig,
                });

                if (waitTime > 100) {
                    this.addStep('swapAnimation', {
                        blocks: [k, k - 1],
                        waitTime: waitTime,
                    });
                } else {
                    this.addStep('swapHeight', {
                        blocks: [k, k - 1],
                    });
                }
                this.addStep('updtComparisons', {});
                k--;
            }

            sizes[k] = markedBlockHeight;
            this.addStep('wait', { waitTime: 50 });
            this.addStep('colorBlocks', {
                blocks: [k],
                color: colors.sorted,
            });

            this.addStep('lowerBlocks', {
                blocks: [k],
                waitTime,
            });
        }
        return true;
    }
}

export default InsertSort;
