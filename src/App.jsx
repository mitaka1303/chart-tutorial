import { useEffect, useState } from "react";
import { fetchAllData } from "./api";
import * as d3 from "d3"


function Graph(props){
  const data = props.dataset;
  const horizontal = props.horizontal;
  const vertical = props.vertical;

  const [visible, setVisible] = useState(null);

  function changeVisible(key){
    const speciesEvent = key;
    const newVisible = visible.find( (visibleObj) => { if(visibleObj.species ==speciesEvent ) return visibleObj });
    if(newVisible.visible == "true"){
      newVisible.visible = "false";
    }else{
      newVisible.visible = "true";
    }
    const responseVisible = visible.map( (obj) => { 
      if(speciesEvent != obj.species) 
        return obj;
      if(speciesEvent == obj.species)
        return newVisible;
     })
     setVisible(responseVisible);
    
  }

  if(data != null){

    if(visible == null){
      const species1  = Array.from (new Set(data.map( (obj) =>{ return obj.species} )));
      const species2 = species1.map( (obj) =>{
        return {
          species: obj,
          visible: "true"  
        }
      })
      setVisible(species2);
    }

    const maxLength = Math.max(...data.map((p) => p[horizontal]));
    const minLength = Math.min(...data.map( (p)=> p[horizontal]));
    const maxWidth = Math.max(...data.map((p) => p[vertical]));
    const minWidth = Math.min(...data.map( (p)=> p[vertical]));
    
    const svgWidth = 500;
    const graphStart = 100;
    const scaleSize = 10;
    const  xScale = d3.scaleLinear()
      .domain([minLength,maxLength]).nice()
      .range([0,400]);

      const yScale = d3.scaleLinear()
      .domain([minWidth,maxWidth]).nice()
      .range([400,0])

    const colorScale = d3.scaleOrdinal()
      .range([ d3.schemeCategory10[0], d3.schemeCategory10[1], d3.schemeCategory10[2] ])

    //縦軸
    var yScaleAxis = "M " + String(graphStart)+ " " +String(graphStart);
    const axisY = yScale.ticks();
    axisY.forEach( (value)=>{
      yScaleAxis += "V" + String(yScale(value) ) +" H " + String(graphStart-scaleSize) + " M "  + String(graphStart) +" "+String(yScale(value) ) ;
    });
    yScaleAxis += " V 400";

    //横軸
    var xScaleAxis = "M " + "100"+ " " + String(svgWidth - graphStart);
    const axisX = xScale.ticks();
    axisX.forEach( (value)=>{
      xScaleAxis += "H" + String(xScale(value) + graphStart ) +" V " + String(svgWidth-graphStart + scaleSize) + " M "  + String(xScale(value) + graphStart) +" "+String(svgWidth-graphStart ) ;
    });
    xScaleAxis += " H 500";
  
    //種類の配列
    let species  = Array.from (new Set(data.map( (obj) =>{ return obj.species} )));
    return(
      <div className="img">
        <svg  className="has-ratio" width = {500} height= {500} viewBox = "0,0,600,500 " style={{width: '100%' ,maxWidth: '700px',height: '700px'}}>

          {
          data.map( (obj,index)=>{
            let visible2 = null;
            let opacity = 1.0;
            const cx=xScale(obj[horizontal])+graphStart
            const cy=yScale(obj[vertical])
            if(visible != null){
              visible2 = visible.find( (visibleObj) => { if(visibleObj.species ==obj.species ) return visibleObj });
            }
            
            if(  visible==null || visible2.visible == "false"){
              opacity =0.0;
            }
            return(
              <circle  transform={`translate(${cx},${cy})`}
              fill={colorScale(obj.species)} r="4" key={index} fillOpacity ={opacity} style={{transition:"transform 0.5s , fill-opacity 0.5s"}} />
            );
          })
          }

          <path d={yScaleAxis} fill ="transparent" stroke="black"/>
          {
            axisY.map( (value,index)=>{
              return(
                <text x = {graphStart-scaleSize -4} y= {yScale(value) + 3} fontSize="10" fill = "black"  textAnchor="end" key = {index}> 
                  {value}
                </text>
              )
            }
            )
          }
          <path d={xScaleAxis} fill ="transparent" stroke="black"/>
          {
            axisX.map( (value,index)=>{
              return(
                <text x = {xScale(value) + graphStart} y= {svgWidth-graphStart + scaleSize + 10} fontSize="10" fill = "black"  textAnchor="middle" key = {index}> 
                  {value}
                </text>
              )
            }
            )
          }

          {
            species.map(  (species , index) =>{
              if(visible != null){
                const newVisible3 = visible.find( (visibleObj) => { if(visibleObj.species ==species ) return visibleObj });
                if(newVisible3.visible=="true"){
                  return <rect x = "500"  y = {index *20 } width = "10" height ="10" fill = {colorScale(species)} key={index}/>
                }else{
                  return (
                      <rect x = "500"  y = {index *20 } width = "10" height ="10" fill = {colorScale(species)} key={index} fillOpacity="0.7"/>
                  )
                }
              }else{
                <rect x = "500"  y = {index *20 } width = "10" height ="10" fill = {colorScale(species)} key={index}/>
              }
              
            }
            )
          }
          {
            //凡例
            species.map(  (species , index) =>{
              if(visible != null){
                const newVisible3 = visible.find( (visibleObj) => { if(visibleObj.species ==species ) return visibleObj });
                if(newVisible3.visible == "true")
                  return <text  onClick={(event)=>{changeVisible(species)}} x = "512"  y = {index *20 + 10 } key={species}>{species}</text>
                else
                  return <text  onClick={(event)=>{changeVisible(species)}} x = "512"  y = {index *20 + 10 } key={species} fillOpacity="0.7" >{species}</text>
              }else{
                return (
                    <text  onClick={(event)=>{changeVisible(species)}} x = "512"  y = {index *20 + 10 } key={species}>{species}</text>
                )
              }
            }
            )
          }
        </svg>
        </div>
    );
  }else{
    return <p>loading</p>
  }
}

function Form(props){
  const setStatus = props.setStatus;
  const [formStatus , setFormStatus] = useState(props.status);

  return (
    <div className="field">
      <div>
        <label className="label">{props.axis}</label>
      </div>
      <div className="control">
        <div className="select is-fullwidth">
          <select className="select" value = {formStatus} onChange={ (event)=>{ setStatus(event.target.value) 
          setFormStatus(event.target.value)}}>
            <option value="sepalLength">sepalLength</option>
            <option value="sepalWidth">sepalWidth</option>
            <option value="petalLength">petalLength</option>
            <option value="petalWidth">petalWidth</option>
          </select> 
        </div>
      </div>
      
    </div>
  )
}


function Board(){
  const [data, setData] = useState(null); 
  const [vertical,setVertical] = useState("sepalWidth");
  const [horizontal,setHorizontal] = useState("sepalLength");
  useEffect( ()=>{
    fetchAllData().then( (data)=>{
      setData(data);
    });
  }, []);
  
  return (
    <div>
      <div className="hero has-background-info" > 
        <div className ="hero-body">
          <div className="container">
            <h1 className="title has-text-white">Scatter Plot of Iris Dataset</h1>
          </div>
            
        </div>
      </div>
        <div className="section">
          <div className="container">
            <Form axis = "x property" setStatus = {setHorizontal} status = {horizontal}/>
            <Form axis = "y property" setStatus = {setVertical}   status = {vertical}/>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <Graph dataset = {data} horizontal ={horizontal} vertical={vertical} />
          </div>
        </div>
        <footer className="footer">
          <div className="content has-text-centered">
            <p>©2022 Yukito Takami</p>
          </div>
        </footer>
    </div>
  );
}


export default function App() {
    return (
      <div>
        <Board/>
      </div>
    );
}



