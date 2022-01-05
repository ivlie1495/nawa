import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const writeClient = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: 'v1',
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true
});

export const readClient = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: 'v1',
  useCdn: true,
  ignoreBrowserTokenWarning: true
});

const bulder = imageUrlBuilder(writeClient)

export const urlFor = (source) => bulder.image(source);