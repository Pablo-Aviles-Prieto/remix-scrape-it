import { cssBundleHref } from '@remix-run/css-bundle';
import { redirect } from '@remix-run/node';
import type {
  MetaFunction,
  ActionFunctionArgs,
  LinksFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import tailwindStylesheet from '~/styles/tailwind.css';
import globalStylesheet from '~/styles/global.css';
import slickStylesheet from 'slick-carousel/slick/slick.css';
import slickThemeStylesheet from 'slick-carousel/slick/slick-theme.css';
import { SearchContainer } from './components/search-container/search-container';
import { AppLayout } from './components/styles/app-layout';
import { Toaster } from 'react-hot-toast';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: tailwindStylesheet },
  { rel: 'stylesheet', href: globalStylesheet },
  { rel: 'stylesheet', href: slickStylesheet },
  { rel: 'stylesheet', href: slickThemeStylesheet },
];

// TODO: Change meta data
// TODO: Remove extra images stored on public folder
// TODO: Add error bounderies
export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const searchWord = formData.get('search')?.toString();

  if (!searchWord) {
    return null;
  }

  const regex = /^(https:\/\/)?(www\.)?coolmod\.com/;
  if (regex.test(searchWord)) {
    return searchWord.startsWith('https://')
      ? redirect(`/search/details?url=${searchWord}`)
      : redirect(`/search/details?url=https://${searchWord}`);
  } else {
    return redirect(`/search/${searchWord}`);
  }
};

export default function App() {
  return (
    <html lang='es'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <AppLayout>
          <section>
            <SearchContainer />
          </section>
          <section className='mt-4'>
            <Outlet />
          </section>
          <Toaster position='bottom-right' />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AppLayout>
      </body>
    </html>
  );
}
