'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const puppeteer = require('puppeteer');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const tocSelector = '#toc',
  noResultsSelector = '#mw-content-text > div > p.mw-search-nonefound',
  abstractSelector = '#mw-content-text > div.mw-parser-output > p';

const baseURLPrefix = 'https://en.wikipedia.org/wiki/Special:Search?search=',
  baseURLSuffix = '&go=Go';

async function fetchKeyword(k_word, page) {
  let noResult = await page.$(noResultsSelector)
  if(noResult) {
    return 'poor keyword'
  } else {
		let toc = await page.$(tocSelector);
		if (!toc) {
      // No table of content. Select the first paragraph
			let abstractElement = await page.$(abstractSelector);
			let abstractText = await page.evaluate(el => el.textContent, abstractElement);
      let abstract = abstractText.replace(/\[(.*?)\]/g, '');
      return abstract;
		}
		else {
			let abstract=''
			let abstractElements = await page.$$(abstractSelector);
			for (let i = 0; i < abstractElements.length; i++) {
				let abstractElement = abstractElements[i];
				let abstractText = await page.evaluate(el => el.textContent, abstractElement);
				if(abstractText.trim() == '') {
					break;
				}
				else {
          abstract = abstract + abstractText.replace(/\[(.*?)\]/g, '') + '\n';
				}
			}
			return abstract;
		}
	}
}
//=============================================================================
/**
 * Export module
 */
//=============================================================================
module.exports = async function (k_words) {
  console.log('in scraper');
  const browser = await puppeteer.launch({timeout: 0});
  const page = await browser.newPage();

  let result = {}
  for (let i = 0; i < k_words.length; i++) {
    const k_word = k_words[i];
    const targetURL = baseURLPrefix + k_word + baseURLSuffix
    await page.goto(targetURL);
    result[k_word] = await fetchKeyword(k_word, page);
  }

  await browser.close();
  return result;
}
//=============================================================================