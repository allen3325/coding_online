import React, { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javaLanguage } from '@codemirror/lang-java';
import { pythonLanguage } from '@codemirror/lang-python';
import 'font-awesome/css/font-awesome.min.css';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import axios from 'axios';

function App() {
  const codeMirrorInstance = useRef(null);
  const [lang, setLang] = useState("javaLanguage");
  const [result, setResult] = useState("");
  const dealCode = (codeInput) => {
    if (codeInput.lastIndexOf('⌄') === -1) {
      // console.log(codeInput)
      if (codeInput.lastIndexOf('Selection deleted') !== -1) {
        // console.log("True")
        let cleanedCode = codeInput.replace(/^Selection deleted[\s\S]+?(?=print\()/, '');
        // console.log(cleanedCode);
        return cleanedCode;
      }
      return codeInput;
    } else {
      let lastDelimiterIndex = codeInput.lastIndexOf('⌄'); // 找到最后一个 ⌄ 的位置
      let result = codeInput.substring(lastDelimiterIndex + 1).trim(); // 取出最后一个 ⌄ 之前的内容并去掉首尾空格
      return result;
    }
  }

  function executeCode(params) {
    const codeMirrorValue = codeMirrorInstance.current.editor.innerText;
    console.log(codeMirrorInstance)
    let code = dealCode(codeMirrorValue);
    // console.log(code);
    let data = {
      "type": lang === 'javaLanguage' ? 'java' : 'python',
      "no": "7112056033",
      "code": code
    }
    let jsonData = JSON.stringify(data);
    // console.log(jsonData)
    axios.post('http://localhost:8080/exec', jsonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('成功 in Backend', res.data.result);
        setResult(res.data.result);
      })
      .catch(err => {
        console.log('錯誤', err);
      })
  }

  const javaCode = `import java.util.HashMap;
public class HelloWorld
{
    public static void main(String[] args)
    {
      System.out.println("Hello World!");
      HashMap<String,String> hashMap = new HashMap<>();
      hashMap.put("a","1");
      System.out.println(hashMap.get("a"));
    }
}`;
  const pythonCode = `# Graph Hash
graph = {}
graph["start"] = {}
graph["start"]["a"] = 6
graph["start"]["b"] = 2

graph["a"] = {}
graph["a"]["fin"] = 1

graph["b"] = {}
graph["b"]["a"] = 3
graph["b"]["fin"] = 5

graph["fin"] = {}

# Cost Hash
infinity = float("inf")
costs = {}
costs["a"] = 6
costs["b"] = 2
costs["fin"] = infinity

# Parents Hash
parents = {}
parents["a"] = "start"
parents["b"] = "start"
parents["fin"] = None

processed = []

def find_lowest_cost_node(costs):
    lowest_cost = float("inf")
    lowest_cost_node = None
    # Search every node
    for node in costs:
        cost = costs[node]
        if cost < lowest_cost and node not in processed:
            lowest_cost = cost
            lowest_cost_node = node
    return lowest_cost_node

# find lowest cost node from costs hash
node = find_lowest_cost_node(costs)

while node is not None:
    cost = costs[node]
    # Search each neigbor node of this node
    neighbors = graph[node]
    for n in neighbors.keys():
        new_cost = cost + neighbors[n]
        if costs[n] > new_cost:
            # update node cost
            costs[n] = new_cost
            parents[n] = node
    # Save node to processed list
    processed.append(node)
    # Find next need to process node
    node = find_lowest_cost_node(costs)

print("Cost from the start to each node:")
print(costs)`;


  return (
    <div style={{ backgroundColor: 'rgb(2,43,54)', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'rgb(2,43,54)' }}>
        <select
          name="lang"
          id="lang"
          value={lang === 'javaLanguage' ? 'javaLanguage' : 'pythonLanguage'}
          onChange={(e) =>
            setLang(
              e.target.value === 'javaLanguage' ? 'javaLanguage' : 'pythonLanguage'
            )
          }
        >
          <option value="javaLanguage">Java</option>
          <option value="pythonLanguage">Python</option>
        </select>
        {/* <h3>{result === "" ? "" : result}</h3> */}
        <div>
          <p style={{ color: "white", whiteSpace: 'pre-line' }}>{result}</p>
        </div>
        <button onClick={() => executeCode()}>
          <i className="fa fa-play" /> {/* 添加了一個播放圖示 */}
        </button>
      </div>
      <CodeMirror
        value={lang === 'javaLanguage' ? javaCode : pythonCode}
        height="90vh"
        extensions={lang === 'javaLanguage' ? [javaLanguage] : [pythonLanguage]}
        theme={solarizedDark}
        ref={codeMirrorInstance}
      />
    </div>
  );
}
export default App;