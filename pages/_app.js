import React, { useMemo } from 'react'
import { TinaProvider, TinaCMS } from 'tinacms'
import '../styles/styles.css'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'
import { GitClient, GitMediaStore } from '@tinacms/git-client'
import { GlobalStyles as TinaStyles } from '@tinacms/styles'
// import { toMarkdownString } from 'next-tinacms-markdown'
// import slugify from 'slugify'
import Nav from '../components/nav'
// import Head from 'next/head'

const App = ({ Component, pageProps }) => {

  const gitClient = useMemo(() => {
    return new GitClient(`/___tina`)
  }, [])
  const cms = useMemo(() => {
    return new TinaCMS({
      enabled: process.env.NODE_ENV !== "production",
      sidebar: true,
      toolbar: { hidden: false },
      plugins: [MarkdownFieldPlugin],
      apis: {
        git: gitClient,
      },
      media: {
        store: new GitMediaStore(gitClient),
      },
    })
  }, [])

  return (
    <TinaProvider cms={cms}>
      <div className="container">
        <TinaStyles />
        <Component {...pageProps} />
      </div>
    </TinaProvider>
  )
}

export default App