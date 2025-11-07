import { NextRequest, NextResponse } from 'next/server';

import { httpClient } from '@/lib/client';
import {
  CambridgeDefinitionData,
  CambridgeDictionaryResponse,
  CambridgeExampleData,
  CambridgePronunciationData,
  CambridgeVerbData,
  cambridgeDictionaryLookupRequestSchema,
} from '@/lib/schema/dictionary.schema';

import axios from 'axios';
import * as cheerio from 'cheerio';

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const getCacheKey = (url: string): string => `cache_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;

const getFromCache = (key: string): any => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        cache.delete(k);
      }
    }
  }
};

// Fetch verb conjugations from Wiktionary
const fetchVerbs = async (wiki: string): Promise<CambridgeVerbData[]> => {
  const cacheKey = getCacheKey(wiki);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await httpClient.get(wiki);
    const $$ = cheerio.load(response.data);
    const verbs: CambridgeVerbData[] = [];

    $$('.inflection-table tr td').each((index, cell) => {
      const cellElement = $$(cell);
      const cellText = cellElement.text().trim();

      if (!cellText) return;

      const pElement = cellElement.find('p');
      if (pElement.length > 0) {
        const pText = pElement.text().trim();
        const parts = pText
          .split('\n')
          .map((p) => p.trim())
          .filter((p) => p);

        if (parts.length >= 2) {
          const type = parts[0];
          const text = parts[1];

          if (type && text) {
            verbs.push({ id: verbs.length, type, text });
          }
        } else {
          const htmlContent = pElement.html();
          if (htmlContent && htmlContent.includes('<br>')) {
            const htmlParts = htmlContent.split('<br>');
            if (htmlParts.length >= 2) {
              const type =
                $$(htmlParts[0]).text().trim() || htmlParts[0].replace(/<[^>]*>/g, '').trim();
              const textPart = htmlParts[1];
              const text = $$(textPart).text().trim() || textPart.replace(/<[^>]*>/g, '').trim();

              if (type && text) {
                verbs.push({ id: verbs.length, type, text });
              }
            }
          }
        }
      }
    });

    setCache(cacheKey, verbs);
    return verbs;
  } catch (error) {
    console.warn(`Failed to fetch verbs from ${wiki}:`, error);
    return [];
  }
};

// Server action for dictionary lookup
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entry = searchParams.get('entry');
    const language = searchParams.get('language');

    if (!entry || !language) {
      return NextResponse.json({ error: 'Missing entry or language parameter' }, { status: 400 });
    }

    let dictLanguage: string;
    let nation = 'us';

    if (language === 'en') {
      dictLanguage = 'english';
    } else if (language === 'uk') {
      dictLanguage = 'english';
      nation = 'uk';
    } else if (language === 'en-vi') {
      dictLanguage = 'english-vietnamese';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const url = `https://dictionary.cambridge.org/${nation}/dictionary/${dictLanguage}/${entry}`;
    console.log('url: ', url);
    const wiki = `https://simple.wiktionary.org/wiki/${entry}`;

    const mainCacheKey = getCacheKey(url);
    const cachedResult = getFromCache(mainCacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const [dictionaryResponse, verbs] = await Promise.allSettled([
      httpClient.get(url),
      fetchVerbs(wiki),
    ]);

    if (dictionaryResponse.status === 'rejected' || dictionaryResponse.value.status !== 200) {
      return NextResponse.json({ error: 'word not found' }, { status: 404 });
    }

    const $ = cheerio.load(dictionaryResponse.value.data);
    const siteurl = 'https://dictionary.cambridge.org';

    const word = $('.hw.dhw').first().text();

    if (!word) {
      return NextResponse.json({ error: 'word not found' }, { status: 404 });
    }

    const posElements = $('.pos.dpos');
    const pos = [...new Set(posElements.map((i, el) => $(el).text()).get())];

    // Phonetics audios
    const audio: CambridgePronunciationData[] = [];
    $('.pos-header.dpos-h').each((i, s) => {
      const posNode = $(s).find('.dpos-g').first();
      if (!posNode.length) return;

      const p = posNode.text();
      $(s)
        .find('.dpron-i')
        .each((j, node) => {
          const $node = $(node);
          const lang = $node.find('.region.dreg').text();
          const audioSrc = $node.find('audio source').attr('src');
          const pron = $node.find('.pron.dpron').text();

          if (audioSrc && pron) {
            audio.push({ pos: p, lang: lang, url: siteurl + audioSrc, pron: pron });
          }
        });
    });

    // definition & example
    const definition: CambridgeDefinitionData[] = $('.def-block.ddef_block')
      .map((index, element) => {
        const $element = $(element);
        const pos = $element.closest('.pr.entry-body__el').find('.pos.dpos').first().text();
        const source = $element.closest('.pr.dictionary').attr('data-id') || '';
        const text = $element.find('.def.ddef_d.db').text();
        const translation = $element.find('.def-body.ddef_b > span.trans.dtrans').text();

        const example: CambridgeExampleData[] = $element
          .find('.def-body.ddef_b > .examp.dexamp')
          .map((i, ex) => {
            const $ex = $(ex);
            return {
              id: i,
              text: $ex.find('.eg.deg').text(),
              translation: $ex.find('.trans.dtrans').text(),
            };
          })
          .get();

        return {
          id: index,
          pos: pos,
          source: source,
          text: text,
          translation: translation,
          example: example,
        };
      })
      .get();

    // api response
    const result: CambridgeDictionaryResponse = {
      word: word,
      pos: pos,
      verbs: verbs.status === 'fulfilled' ? verbs.value : [],
      pronunciation: audio,
      definition: definition,
    };

    setCache(mainCacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
