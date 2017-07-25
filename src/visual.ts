/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {

    //PBI_TEMPLATE_1: interface definition blocks
    interface Visual_settings_model_params {
        modelType: string;
        targetSeasonality: string;
        freq: number;
    }

    interface Visual_settings_algo_params {
        degree: boolean;
        robustToOutliers: boolean;
        percentile: number;
    }

    interface Visual_settings_plot_params {
        plotType: string;
        weight: number;
        lineCol: string;
        labelsCol: string;
        textSize: number;
    }

    interface Visual_settings_extra_params {
        show: boolean;
        textSize: number;
        infoCol: string;
    }

    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        //PBI_TEMPLATE_2: declare groups of parameters
        private settings_model_params: Visual_settings_model_params;
        private settings_algo_params: Visual_settings_algo_params;
        private settings_plot_params: Visual_settings_plot_params;
        private settings_extra_params: Visual_settings_extra_params;


        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            //PBI_TEMPLATE_3: groups of parameters and defaults
            this.settings_model_params = <Visual_settings_model_params>{
                modelType: "automatic",
                targetSeasonality: "autodetect from date",
                freq: 12,
            };

            this.settings_algo_params = <Visual_settings_algo_params>{
                degree: false,
                robustToOutliers: true,
                percentile: 50,
            };

            this.settings_plot_params = <Visual_settings_plot_params>{
                plotType: "all",
                weight: 10,
                lineCol: "red",
                labelsCol: "orange",
                textSize: 10,
            };

            this.settings_extra_params = <Visual_settings_extra_params>{
                show: true,
                textSize: 10,
                infoCol: "brown",
            };
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

             if (dataViews == null)
                return;


            let dataView: DataView = dataViews[0];

            if (dataView == null)
                return;

            if (!dataView || !dataView.metadata)
                return;

            //PBI_TEMPLATE_4: groups of parameters populate values 
            this.settings_model_params = <Visual_settings_model_params>{
                modelType: getValue<string>(dataView.metadata.objects, 'settings_model_params', 'modelType', "automatic"),
                targetSeasonality: getValue<string>(dataView.metadata.objects, 'settings_model_params', 'targetSeasonality', "autodetect from date"),
                freq: getValue<number>(dataView.metadata.objects, 'settings_model_params', 'freq', 12),
            };

            this.settings_algo_params = <Visual_settings_algo_params>{
                degree: getValue<boolean>(dataView.metadata.objects, 'settings_algo_params', 'degree', false),
                robustToOutliers: getValue<boolean>(dataView.metadata.objects, 'settings_algo_params', 'robustToOutliers', true),
                percentile: getValue<number>(dataView.metadata.objects, 'settings_algo_params', 'percentile', 50),
            };

            this.settings_plot_params = <Visual_settings_plot_params>{
                plotType: getValue<string>(dataView.metadata.objects, 'settings_plot_params', 'plotType', "all"),
                weight: getValue<number>(dataView.metadata.objects, 'settings_plot_params', 'weight', 10),
                lineCol: getValue<string>(dataView.metadata.objects, 'settings_plot_params', 'lineCol', "red"),
                labelsCol: getValue<string>(dataView.metadata.objects, 'settings_plot_params', 'labelsCol', "orange"),
                textSize: getValue<number>(dataView.metadata.objects, 'settings_plot_params', 'textSize', 10),
            };

            this.settings_extra_params = <Visual_settings_extra_params>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_extra_params', 'show', true),
                textSize: getValue<number>(dataView.metadata.objects, 'settings_extra_params', 'textSize', 10),
                infoCol: getValue<string>(dataView.metadata.objects, 'settings_extra_params', 'infoCol', "brown"),
            };

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + 'px';
            this.imageDiv.style.width = finalViewport.width + 'px';
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                //PBI_TEMPLATE_5: populate switch cases
                case 'settings_model_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            modelType: this.settings_model_params.modelType,
                            targetSeasonality: this.settings_model_params.targetSeasonality,
                        },
                        selector: null
                    });
                    if (this.settings_model_params.targetSeasonality == "manual") {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                freq: inMinMax(this.settings_model_params.freq, 1, 10000)
                            },
                            selector: null
                        });
                    }
                    break;
                case 'settings_algo_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            degree: this.settings_algo_params.degree,
                            robustToOutliers: this.settings_algo_params.robustToOutliers,
                            percentile: inMinMax(this.settings_algo_params.percentile, 1, 100),
                        },
                        selector: null
                    });
                    break;
                case 'settings_plot_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            plotType: this.settings_plot_params.plotType,
                            weight: inMinMax(this.settings_plot_params.weight, 1, 50),
                            lineCol: this.settings_plot_params.lineCol,
                            labelsCol: this.settings_plot_params.labelsCol,
                            textSize: inMinMax(this.settings_plot_params.textSize, 8, 40),
                        },
                        selector: null
                    });
                    break;
                case 'settings_extra_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings_extra_params.show,
                            textSize: inMinMax(this.settings_extra_params.textSize, 8, 40),
                            infoCol: this.settings_extra_params.infoCol,
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }
    }
}
