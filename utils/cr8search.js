'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const
  scrape = require('./scraper'),
  sendReport = require('./sendReport'),
  sendCorrection = require('./sendCorrection');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = async function (email, p_num, k_words) {
  const words = k_words.split(',');
  let data = await scrape(words);
  console.log('done scraping');
  console.log(data);
  let corrections = '';
  let report = '';

  for (const key in data) {
    if (data[key].trim() == 'poor keyword') {
      corrections += data[key] + ','
    }
    else {
      report += '<h2>' + key + '</h2><br>' + data[key] + '<hr>';
    }
  }

  if (corrections !== '') {
    'sending correction'
    return sendCorrection(corrections, p_num);
  }

  if (report !== '') {
    'sending report'
    return sendReport(email, report, p_num);
  }
};
//=============================================================================
