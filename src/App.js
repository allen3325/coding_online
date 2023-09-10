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
        console.log('成功', res.data.result);
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
  const pythonCode = `# 圖形雜湊表
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

# 成本雜湊表
infinity = float("inf")
costs = {}
costs["a"] = 6
costs["b"] = 2
costs["fin"] = infinity

# 父節點雜湊表
parents = {}
parents["a"] = "start"
parents["b"] = "start"
parents["fin"] = None

processed = []

def find_lowest_cost_node(costs):
    lowest_cost = float("inf")
    lowest_cost_node = None
    # 遍歷每個節點
    for node in costs:
        cost = costs[node]
        # 如果是目前最低的成本且尚未處理過的節點
        if cost < lowest_cost and node not in processed:
            # 將該節點更新為最低成本的新節點
            lowest_cost = cost
            lowest_cost_node = node
    return lowest_cost_node

# 由 costs 這個雜湊表中找出成本最低的節點
node = find_lowest_cost_node(costs)
# 處理完所有節點時，這個 while 迴圈就會結束
while node is not None:
    cost = costs[node]
    # 遍歷此節點的所有相鄰節點
    neighbors = graph[node]
    for n in neighbors.keys():
        new_cost = cost + neighbors[n]
        # 如果通過這個節點到達相鄰節點的成本較低，則：
        if costs[n] > new_cost:
            # 更新這個節點的成本
            costs[n] = new_cost
            # 這個節點會成為相鄰節點的新父節點
            parents[n] = node
    # 將節點存入已處理的串列中
    processed.append(node)
    # 找出下一個需要處理的節點，並繼續執行迴圈
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