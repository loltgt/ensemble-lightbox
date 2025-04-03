
import {argv} from 'node:process';
import {readFile, writeFile} from 'node:fs/promises';
import {PDFDocument, PDFName} from 'pdf-lib';

const inputBuffer = await readFile(argv[2] ?? 'input.pdf');

const output = await PDFDocument.create();
const input = await PDFDocument.load(inputBuffer);

output.setAuthor('');
output.setCreationDate(input.getCreationDate());
output.setCreator('');
output.setProducer('');
output.setTitle(input.getTitle());

const pages = await output.copyPages(input, input.getPageIndices());
pages.forEach((page) => {
  page.setTrimBox(0, 0, page.getWidth(), page.getHeight());
  output.addPage(page);
});

const metadata = input.catalog.lookup(PDFName.of('Metadata'));
const text = new TextDecoder('ISO-8859-1');
let metadataXML = text.decode(metadata.contents);
metadataXML = metadataXML.replace(/<rdf:Description.+pdf:Producer.+\/>\n/, '')
  .replace(/<rdf:Description.+<\/rdf:Description>\n/, '')
  .replace(/<dc:creator>.+<\/dc:creator>/, '');
const metadataStream = output.context.stream(metadataXML, {
  Type: 'Metadata',
  Subtype: 'XML',
  Length: metadataXML.length
});
const metadataStreamRef = output.context.register(metadataStream);
output.catalog.set(PDFName.of('Metadata'), metadataStreamRef);

const outputBuffer = await output.save({
  useObjectStreams: false
});

await writeFile(argv[3] ?? 'output.pdf', outputBuffer);

