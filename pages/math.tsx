import React from 'react';

// import react-mathjax

const text = `Calculate the pOH for all the solutions and use <math>pOH\\alpha\\frac{1}{\\left\\lbrack OH\\right\\rbrack}</math> Therefore, the smallest pOH gives the highest [OH]`;
const mathDelimiterRegex = /<math>(.*?)<\/math>/g;
export function replaceMathDelimiters(text: string|undefined) {
  if(text === undefined || text === '' || text === null){ 
    console.log('out here')
    return text;
  }
  console.log(text)
  const replacedText = text.replace(/\\rArr|\\rarr/g, '\\rightarrow');
  const parts = replacedText.split(mathDelimiterRegex);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      console.log('came here')
      // Create a MathJax.Node element with the extracted formula
      return <div className="w-100" key={index+1}  style={{overflowWrap: 'break-word', overflowX:'scroll'}}></div>;
        {/*<MathJax.Node inline formula={part} key={index} />*/}
    } else {
      console.log('No math')
      return part;
    }
  });
}


const App = () => {
  const inlineFormula = `\\int_1^3\\left(x^2+\\frac{x}{4}\\right)dx`;
  const blockFormula = `\\int_0^\\infty x^2 dx`; 

  return <div style={{padding: 50}}>
    
     {/* <div>
       
        <p>Inline formula: <MathJax.Node inline formula={inlineFormula} /></p>
        <hr></hr>
        <p>Block formula:</p>
        <MathJax.Node formula={blockFormula} />
</div>*/}






{ replaceMathDelimiters(text)}


    
  </div>;
};

export default App;