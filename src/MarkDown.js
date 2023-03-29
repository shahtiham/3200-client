import './bodySection.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import React from 'react';

/* import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c'; */
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {coyWithoutShadows,coldarkCold,base16AteliersulphurpoolLight,coy} from 'react-syntax-highlighter/dist/esm/styles/prism'

function MarkDown({text}){
    console.log('M')
    let ar;
    const r = /\[tag:(\w+)\]/g;
    let b = 0;
    while (1) {
      ar = r.exec(text?.substring(b));
      //break;
      if(ar === null) break
      //b = r.lastIndex + 1
      text = text.replace(`[tag:`+ ar[1] +`]`, `[`+ ar[1] +`](https://#)`)
      //console.log(ar, b);
    }
    return(
        <ReactMarkdown style={{overflowWrap:"break-word"}} skipHtml={false} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm, {singleTilde: false}]} 
                  
                  components={{
                    //Rsh,
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        //console.log('in :',inline,'cl :', className,'m :', match, children)
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={coyWithoutShadows}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : ((inline && !match) ? (
                            <code style={{backgroundColor:"rgb(227, 230, 232)",borderRadius:'3px',position:"relative",display:"inline", padding:'2px 4px 2px 4px',width:'auto',height:'auto'}}>
                                {children}
                            </code>
                        ) : (
                          <code style={{backgroundColor:"rgb(246, 246, 246)",position:"relative",display:"block",width:"100%",padding:'5px',minHeight:"18.4px",
                          overflowX:'auto',overflowY:'auto',overflowWrap:'normal',maxHeight:'600px',borderRadius:'3px'}} className={className} {...props}>
                            {children}
                          </code>
                        ));
                    },
                    blockquote : ({node, children, ...props}) => {
                      const match = /^!/.exec(children[1]?.props?.children[0] || '')
                      //console.log(node, children, props)
                      if(match){
                          children[1].props.children[0] = children[1]?.props?.children[0].replace(/^!/, "")
                      }
                      return !match?(
                          <blockquote>{children}</blockquote>
                      ):(
                        <blockquote style={{backgroundColor: 'hsl(210,8%,95%)'}}
                            className='clkabl-q clkabl-q-p'
                            onClick={(e) => {
                                if(e.target.classList.contains('clkabl-q-p')){
                                    e.target.classList.remove('clkabl-q-p')
                                }
                            }}
                        >
                            {children}
                        </blockquote>
                      )
                    },
                    a: ({node, children, ...props}) => {
                      //console.log(node, children)
                        return node.properties.href === 'https://#'?(
                          <a href='#' style={{pointerEvents:'none', backgroundColor:'hsl(205,46%,92%)', textDecoration:'none', 
                              color:'hsl(205,47%,42%)', paddingLeft:'6px', paddingRight:'6px', paddingBottom:'2px', borderRadius:'4px',fontSize:'12px'}}
                          >{children}</a>
                        ):(
                            <a href={node.properties.href}>{children}</a>
                        );
                    },
                    kbd: ({node, children, ...props}) => {
                        return(
                            <kbd style={{
                              border:'1px solid hsl(210,8%,65%)',backgroundColor:'hsl(210,8%,90%)',paddingLeft:'1px',paddingRight:'1px',
                              borderTopColor:'rgb(159, 166, 173)',
                              boxShadow:"0 1px 1px hsla(210,8%,5%,0.15), inset 0 1px 0 0 hsl(0, 0%, 100%)",
                            }}>{children}</kbd>
                        )
                    },
                    // p: ({node, children, ...props}) => {
                    //   // console.log(children, /\[tag:(\w+)\]/.exec(String(children) || ''))
                    //   console.log(node)
                    //   console.log(children)
                    //   console.log(props)
                    //   const ch = []
                    //   children.forEach((value, index) => {
                    //       console.log(value)
                    //      if(typeof(value) === 'string'){
                    //         console.log(/\[tag:(\w+)\]/g.exec(value || ''))
                    //         const fnd = /\[tag:(\w+)\]/g.exec(value || '')
                    //         if(fnd !== null){
                    //           value = value.replace(/\[tag:(\w+)\]/, '```'+fnd[1] + '```')
                    //         }
                    //         console.log(value)
                    //         ch.push(value)
                    //         const ob = {
                    //           $$typeof:Symbol(React.element),
                    //           key:'ran-l-1',
                    //           props:{
                    //             children:["el"],
                    //             href:'#',
                    //           },
                    //           ref:null,
                    //           type:'a',
                    //         }
                    //         ch.push(ob)
                    //      } else {
                    //         ch.push(value)
                    //      }
                    //   })
                    //   console.log(ch)
                    //   return(<p>{ch}</p>)
                    // },
                    table: ({node, ...props}) => <div className='tcont'><table {...props} /></div>
                }}>
                    { text }
                </ReactMarkdown>
    );
}

export default MarkDown;