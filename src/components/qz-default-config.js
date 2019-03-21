export default {

    // VueQzTray settings
    base: {

        // Styling
        // When true, adds a class to the vue-qz-tray root element
        // All styling within the package needs this class, otherwise everything is unstyled.
        styling: true

    },

    // VueQzTrayConnect settings
    connect: {

        // Retries
        // The connection will be retried x times
        retries: 5,

        // Delay
        // Wait x secs between tries
        delay: 1

    },

    // VueQzTrayPrinters settings
    printers: {

        // The default printer that should be selected directly after retrieving the printers from QZ if it is present.
        // This value is only for illustration as any printers you can connect to will most likely have other names.
        defaultPrinter: 'Eventix Printera'

    },

    // VueQzTrayOptions settings
    // All these options are send to the printer when printing, unless overwritten.
    /** {@link qz.configs.setDefaults} */
    'print-options': {

        colorType: {
            label: 'Color type',
            value: 'color',
            type: 'select',
            options: {
                'color': 'Color',
                'grayscale': 'Gray-scale',
                'blackwhite': 'Black and white'
            },
            hidden: true
        },
        copies: {
            label: 'Copies',
            value: 1,
            type: 'number',
            hidden: true
        },
        density: {
            label: 'density',
            value: 0,
            type: 'number',
            hidden: true
        },
        duplex: {
            label: 'duplex',
            value: false,
            type: 'checkbox',
            hidden: true
        },
        fallbackDensity: {
            label: 'fallbackDensity',
            value: null,
            type: 'number',
            hidden: true
        },
        interpolation: {
            label: 'interpolation',
            value: 'bicubic',
            type: 'text',
            hidden: true
        },
        jobName: {
            label: 'Print job name',
            value: null,
            type: 'text',
            hidden: false
        },
        legacy: {
            label: 'legacy',
            value: false,
            type: 'checkbox',
            hidden: true
        },
        margins: {
            label: 'Margins',
            value: {
                top: {
                    label: 'Top',
                    value: 0,
                    type: 'number'
                },
                right: {
                    label: 'Right',
                    value: 0,
                    type: 'number'
                },
                bottom: {
                    label: 'Bottom',
                    value: 0,
                    type: 'number'
                },
                left: {
                    label: 'Left',
                    value: 0,
                    type: 'number'
                }
            },
            type: 'object',
            hidden: true
        },
        orientation: {
            label: 'Orientation',
            value: 'portrait',
            type: 'select',
            options: {
                'portrait': 'Portrait',
                'landscape': 'Landscape',
                'reverse-landscape': 'Reverse landscape'
            },
            hidden: true
        },
        paperThickness: {
            label: 'paperThickness',
            value: null,
            type: 'number',
            hidden: true
        },
        printerTray: {
            label: 'printerTray',
            value: null,
            type: 'text',
            hidden: true
        },
        rasterize: {
            label: 'Rasterize',
            value: false,
            type: 'checkbox',
            hidden: true
        },
        rotation: {
            label: 'rotation',
            value: 0,
            type: 'number',
            hidden: true
        },
        scaleContent: {
            label: 'Scale content',
            value: true,
            type: 'checkbox',
            hidden: true
        },
        size: {
            label: 'size',
            value: {
                width: {
                    label: 'Width',
                    value: null,
                    type: 'number'
                },
                height: {
                    label: 'Height',
                    value: null,
                    type: 'number'
                }
            },
            type: 'object',
            hidden: true
        },
        units: {
            label: 'Units',
            value: 'in',
            type: 'select',
            options: {
                'in': 'Inches',
                'cm': 'Centimeter',
                'mm': 'Millimeter'
            },
            hidden: true
        },
        altPrinting: {
            label: 'altPrinting',
            value: false,
            type: 'checkbox',
            hidden: true
        },
        encoding: {
            label: 'encoding',
            value: null,
            type: 'text',
            hidden: true
        },
        endOfDoc: {
            label: 'endOfDoc',
            value: null,
            type: 'string',
            hidden: true
        },
        perSpool: {
            label: 'perSpool',
            value: 1,
            type: 'number',
            hidden: true
        }

    },

    // VueQzTrayInput settings
    input: {

        // The default type of input data
        // This tells vue-qz-tray what print method to use.
        // TODO list types
        type: 'html',

        // The format to print the type in, allowed values depend op type
        // TODO list formats
        format: 'plain',

        // Other options
        // TODO implement these options
        // options: {}

        // The default data to be printed
        data: 'Test data for printing. If you do not expect to see this, you should add a \'vue-qz-tray-input\' element to override this value'

    }

};
