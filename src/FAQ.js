import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import {AppProvider} from './Context'

function FAQ() {
    return (
        <>
            <div style={{display:'block', paddingLeft:'20px'}} className='sec2q'>
                <h2 style={{fontWeight:'450'}}> Privileges </h2>
                <h4 style={{fontWeight:'450'}}>Privileges are the facilities that users get at coding-queries.</h4>
                <div style={{display:'flex', position:'relative',  height:'auto', width:'100%'}}>
                    <h3 style={{paddingLeft:'15%',fontWeight:'450'}}>Reputation point</h3>
                    <h3 style={{paddingLeft:'35%',fontWeight:'450'}}>Privilage</h3>
                </div>
                <hr />
                <div style={{display:'flex', position:'relative',  height:'auto', width:'100%', fontSize:'14px'}}>
                    <div style={{display:'flex', position:'relative',  height:'auto', width:'40%', marginLeft:'2%'
                                , alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>0</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>20</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>75</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>125</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>350</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>1000</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>1500</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>3000</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>5000</h3>
                    </div>
                    <div style={{display:'flex', position:'relative',  height:'auto', width:'60%'
                                , alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Ask a question/post an answer</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Upvote on question or answer</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Set bounty</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Downvote on question or answer</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Edit own question/answer</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>comment on answer</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Request new tag</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Suggest edits</h3>
                        <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px'}}>Moderator</h3>
                    </div>
                </div>
                <hr />

                <h2 style={{fontWeight:'450'}}> Reputation </h2>
                <h4 style={{fontWeight:'450'}}>Reputation point indicates the level of contribution of an user. Higher reputation means positive contribution.</h4>
                <h3 style={{fontWeight:'450'}}>User gains reputation point by:</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>question is upvoted:+10</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>answer is upvoted:+10</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>answer is accepted:+15 (+2 to acceptor)</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>suggested edit is accepted:+2</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>bounty awarded:+(bounty value)</h3>
                
                <h3 style={{fontWeight:'450'}}>User loses reputation point by:</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>for downvoting a question:-1</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>for downvoting an answer:-1</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>user's question is downvoted:-2</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>user's answer is downvoted:-2</h3>
                <h3 style={{fontWeight:'450', marginTop:'2px', marginBottom:'8px', fontSize:'16px', paddingLeft:'40px'}}>for bounty:-(bounty value)</h3>
                
                <hr/>

            </div>
        </>
    );
}

export default FAQ;