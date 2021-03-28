import Head from 'next/head'
import { parseMdFile } from '../helpers/markdown'
import { translateText } from '../helpers/translate'

import ReactMarkdown from 'react-markdown'
import { useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, InlineText, InlineBlocks, InlineField } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'
// import ProductCard from '../components/productCard'
// import ProductList from '../components/productList'
// import createProductBlock from '../blocks/productListBlock'
// import { useMemo } from 'react'
// import heroBlock from '../blocks/heroBlock'
import { toMarkdownString } from 'next-tinacms-markdown'
import { useState, useRef } from 'react'
import { Button } from '@tinacms/styles'

const Home = ({ markdownFile }) => {

  const ENGLISH = "English";
  const SPANISH = "Spanish";
  const EDITMODE = "Edit Mode";
  const VIEWMODE = "View Mode";

  const [btn_lang, setBtnLang] = useState(SPANISH);
  const [btn_mode, setBtnMode] = useState(EDITMODE);
  const line1 = useRef(null);

  const cms = useCMS()
  const [editableData, form] = useForm({
    initialValues: markdownFile,
    id: markdownFile.fileName,
    label: markdownFile.fileName,
    fields: [],
    onSubmit: (formState) => {
      toMarkdownString(formState)
      return cms.api.git.writeToDisk({
        fileRelativePath: markdownFile.fileRelativePath,
        content: toMarkdownString(formState),
      }).then(() => {
        cms.alerts.success('Home page saved!')
      })
    },
  })

  const [input_value, setInputValue] = useState(editableData.frontmatter.title);

  usePlugin(form)

  var onInputChange = (e) => {
    setInputValue(e.target.value);
    editableData.frontmatter.title = e.target.value;
  }

  var onClickLangBtn = () => {
    var text = editableData.frontmatter.title;
    if (btn_lang == ENGLISH) { 
      setBtnLang(SPANISH) 
      translateText(editableData.frontmatter.title, 'es', 'en').then(function(data) {
        var json_data = JSON.parse(data);
        text = json_data.data.translations[0].translatedText;
        editableData.frontmatter.title = text;
        setInputValue(text);
      });

    } else { 
      setBtnLang(ENGLISH)
      translateText(editableData.frontmatter.title, 'en', 'es').then(function(data) {
        var json_data = JSON.parse(data);
        text = json_data.data.translations[0].translatedText;
        editableData.frontmatter.title = text;
        setInputValue(text);
      });

    }
    setInputValue(text);
    console.log(input_value);

  }

  var onClickModeBtn = () => {
    if (btn_mode == EDITMODE) { setBtnMode(VIEWMODE) }
    else { setBtnMode(EDITMODE) }
    setInputValue(editableData.frontmatter.title);
  }

  return (
    <InlineForm form={form}>
      <div className="display-non">{input_value}</div>
      <Head>
        <title>Temp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button onClick={onClickLangBtn}>{btn_lang}</Button>
      <Button onClick={onClickModeBtn}>{btn_mode}</Button>
      <InlineField name="title">
        {({ input }) => {
          if (cms.enabled) {
            if (btn_mode == VIEWMODE)
              return <div><input value={input_value} onChange={onInputChange} className="front-edit mt-5" /></div>
            else
              return <h1>{editableData.frontmatter.title}</h1>
          } else {
            if (btn_mode == VIEWMODE)
              return <div><input value={input_value} onChange={onInputChange} className="front-edit mt-5" /></div>
            else
              return <h1>{editableData.frontmatter.title}</h1>
          }
        }}
      </InlineField>
      {/* <input type="text" onChange={onChange()} /> */}
    </InlineForm>
  )
}

const getStaticProps = async () => {
  return {
    props: {
      markdownFile: parseMdFile('pages/home.md'),
    }
  }
}

export default Home
export {
  getStaticProps
}