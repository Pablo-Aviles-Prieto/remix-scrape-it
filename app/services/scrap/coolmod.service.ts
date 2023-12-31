import { COOLMOD_BASE_RUL } from '~/utils/const';
import { getBrowser } from './browser.service';
import { transformDecimalOperator } from '~/utils/transform-decimal-operator';

export const getCoolmodSingleItem = async ({
  productPage,
}: {
  productPage: string;
}) => {
  const browser = await getBrowser();

  const page = await browser.newPage();
  await page.goto(productPage);
  await page.waitForLoadState('domcontentloaded');

  let itemData = undefined;
  const inputElement = await page.$('#layerdt');
  const itemName =
    (await inputElement?.getAttribute('data-itemname')) || undefined;

  const imgElement = await page.$('#productmainimageitem');
  const imgPath = (await imgElement?.getAttribute('src')) || undefined;

  try {
    const oldPrice = await page.$eval(
      '#discountProductPrice .crossout',
      (el) => {
        const amount = el.querySelector('#oldprice')?.textContent?.trim();
        const currency = el.textContent?.replace(amount ?? '', '').trim();
        return { amount, currency };
      }
    );
    const actualPrice =
      (await inputElement?.getAttribute('data-itemprice')) || undefined;

    const discountElement = await page.$('.ratebox');
    const discount =
      (await discountElement?.textContent())?.trim() || undefined;

    itemData = {
      oldPrice: oldPrice.amount,
      actualPrice, // Returned in JS number (2399.95 instead of 2.399,95)
      itemName,
      currency: oldPrice.currency,
      imgPath,
      discount,
    };
  } catch (err) {
    // Meaning the product doesnt have a discount
  }

  if (!itemData?.oldPrice) {
    const actualPrice = await page.$eval('#normalpriceproduct', (el) => {
      const amount = el
        .querySelector('#normalpricenumber')
        ?.textContent?.trim();
      const currency = el.textContent?.replace(amount ?? '', '').trim();
      return { amount, currency };
    });

    itemData = {
      actualPrice: transformDecimalOperator(actualPrice.amount ?? ''),
      itemName,
      currency: actualPrice.currency,
      imgPath,
    };
  }

  await browser.close();
  return itemData;
};

export const getCoolmodListItems = async ({
  querySearch,
}: {
  querySearch: string;
}) => {
  const browser = await getBrowser();

  const page = await browser.newPage();
  const url = `${COOLMOD_BASE_RUL}#/dffullscreen/query=${querySearch}`;
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');

  const listItems = await page.$$eval(
    'div.df-card[data-role="result"]',
    (items) => {
      const parsedItems = items.map((item) => {
        const url = item.querySelector('.df-card__main')?.getAttribute('href');
        const imgPath = item
          .querySelector('.df-card__image img')
          ?.getAttribute('src')
          ?.replace('normal', 'large');
        const name = item.querySelector('.df-card__title')?.textContent?.trim();
        const price = item
          .querySelector('.df-card__price')
          ?.textContent?.trim();
        return {
          name,
          url,
          imgPath: `https:${imgPath}`,
          price: price?.replace('€', '').trim(),
          currency: '€',
        };
      });
      return parsedItems;
    }
  );

  await browser.close();
  return listItems;
};
