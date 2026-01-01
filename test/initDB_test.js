import { assertEquals } from '@std/assert';
import { csvParser } from '../database/setup/initDb.js';

Deno.test('Parsing CSV Data', () => {
	const sampleCsvData = `table1,path.csv\ntable2,path.csv`;
	const actual = csvParser(sampleCsvData);
	const expected = [
		['table1', 'path.csv'],
		['table2', 'path.csv'],
	];
	assertEquals(actual, expected);
});
