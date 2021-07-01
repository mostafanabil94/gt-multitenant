import { Service } from 'typedi';
import * as path from 'path';
import ejs = require('ejs');
import moment from 'moment';
// import * as PdfPrinter from 'pdfmake';

@Service()
export class PdfService {

    // upload image
    public sendPdf(pdfDoc: any): Promise<any> {
        // Create the parameters for calling createBucket
        return new Promise((resolve, reject) => {
            this.createPdfBinary(pdfDoc, (binary) => {
                return resolve(binary);
            });
        });
    }

    public createPdfBinary(pdfDoc: any, callback: any): void {

        const fontDescriptors = {
          Roboto: {
            normal: path.join(process.cwd(), 'fonts' + '/' + '/Roboto-Regular.ttf'),
            bold: path.join(process.cwd(), 'fonts' + '/' + '/Roboto-Medium.ttf'),
            italics: path.join(process.cwd(), 'fonts' + '/' + '/Roboto-Italic.ttf'),
            bolditalics: path.join(process.cwd(), 'fonts' + '/' + '/Roboto-MediumItalic.ttf'),
          },
        };

        const pdfMakePrinter = require('pdfmake');

        const printer = new pdfMakePrinter(fontDescriptors);
        const doc = printer.createPdfKitDocument(pdfDoc);
        const chunks = [];
        // let result: any;
        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        doc.on('end', () => {
        //   result = Buffer.concat(chunks);
          callback(Buffer.concat(chunks));
        });
        doc.end();
      }

      public createPDFFile(htmlString: any, isDownload: boolean = false, reportGeneratedBy: string = ''): Promise<any> {
        const pdf = require('html-pdf');
        const directoryPath = 'file://' + path.join(process.cwd(), 'uploads');
        console.log(directoryPath);
        const options = {
            format: 'A4',
            base: directoryPath,
            margin: { top: '0mm', left: '5mm', bottom: '-5mm', right: '5mm' },
            timeout: 60000,
            zoomFactor: '0.5',
            quality: '100',
        };
        /**
         * It will create PDF of that HTML into given folder.
         */
        return new Promise((resolve, reject) => {
          pdf.create(htmlString, options).toBuffer((err, buffer) => {
            if (err) {
              return reject(err);
            }
            if (isDownload) {
              resolve('data:application/pdf;base64,' + buffer.toString('base64'));
            }
            return resolve(buffer);
          });
        });
      }

      public readHtmlToString(templateName: string, templateData: any ): Promise<any> {
        return new Promise((resolve, reject) => {
          ejs.renderFile('./src/report/' + templateName + '.ejs', {data: templateData, moment}, (err: any, data: any) => {
            if (err) {
              console.log(err);
              return reject(err);
            }
            return resolve(data);
          });
        });
      }

}
