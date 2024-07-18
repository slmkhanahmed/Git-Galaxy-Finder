import React from 'react'
import ReactDOM from 'react-dom/client'
import ContentApp from './ContentApp'

setTimeout(initial, 1000)

function initial() {
  // Create a new div element and append it to the document's body
  // document.body.appendChild(rootDiv)

  // Use `createRoot` to create a root, then render the <App /> component
  // Note that `createRoot` takes the container DOM node, not the React element
  const rootDiv = document.createElement('div');
  const root = ReactDOM.createRoot(rootDiv);
 
  // m1:
  // const beforeSearch = document.querySelector('adadad');
  // m2: 
  const xeval = new XPathEvaluator();
  const res = xeval.evaluate(`//\*[@id="user-list-repositories"]`, document.body);
  const beforeSearch = res.iterateNext()
  const beforeSearchParent = beforeSearch?.parentNode;
// beforeSearch?.insertBefore(rootDiv);
if (beforeSearchParent)
beforeSearchParent.insertBefore(rootDiv, beforeSearch);

  root.render(<ContentApp />)
}
