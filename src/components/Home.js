import { useState } from "react"
import OpenAI from 'openai';

const Home = () => {

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    const [prompt, setPrompt] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[
                {
                    "role":"user",
                    "content": prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 4000
          });
          console.log("response", result);
          setApiResponse(result.choices[0].message.content);
        } catch (e) {
          console.log(e);
          setApiResponse("Something is going wrong, Please try again.");
        }
        setLoading(false);
      };

      const handleSuggest = async (text,e) => {
        setLoadingSuggest(true);
        console.log("handleSuggest")
        var improveText = "User passed prompt: " + text + ". Improve this prompt and answer the question as well"
        console.log(improveText)
        try {
          const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[
                {
                    "role":"user",
                    "content": improveText
                }
            ],
            temperature: 0.2,
            max_tokens: 4000
          });
          console.log("response", result);
          setApiResponse(result.choices[0].message.content);
        } catch (e) {
          console.log(e);
          setApiResponse("Something is going wrong, Please try again.");
        }
        setLoadingSuggest(false);
      }

    return ( 
        <div className="home">
            <h1 style={{paddingBottom:"5%"}}>Ask Mr. Smarty Pants!</h1>            
            <form onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    value={prompt}
                    placeholder="Mr. Know It All will help you here..."
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{height: '300px', width : '800px'}}
                ></textarea>
                <div style={{
                color: 'white', 
                backgroundColor: '#f1356d',
                borderRadius: '8px',
                width: "125px",
                height: '40px'
                }}>
                <button
                    disabled={loading || prompt.length === 0}
                    type="submit"
                    style={{width: "inherit", height: "inherit"}}
                    
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
                </div>

                <div style={{
                color: 'white', 
                backgroundColor: '#f1356d',
                borderRadius: '8px',
                width: "125px",
                height: '40px',
                marginTop: "2%"
                }}>
                <button
                    onClick={(e) => handleSuggest(prompt,e)}
                    disabled={loadingSuggest}
                    type="submit"
                    style={{width: "inherit", height: "inherit"}}
                    
                >
                    {loadingSuggest ? "Suggesting More..." : "Suggest Better"}
                    
                </button>
                </div>

            </form>
            <div>
                {apiResponse && (
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "fit-content"
                    }}
                    >
                    <div style={{
                        wordWrap: "break-word"}}>
                            <pre>
                            <strong>API response:</strong>
                            <p style={{width: "100%", textWrap: "balance"}}>{apiResponse}</p>
                            </pre>
                    </div>
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default Home;