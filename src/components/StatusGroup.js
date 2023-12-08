import { Button, Card, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useDispatch } from "react-redux";
import { UpdateGroups } from '../redux/action';


const StatusGroup = ({ newgroups }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [isAllGroupsValid, setIsAllGroupsValid] = useState(true)

  const addGroup = () => {
    const newObj = {
      from:  "",
      to: "",
      todos: []
    };
    dispatch(UpdateGroups([...newgroups, newObj]))
  };

  const handlValueChange = (value, index, name) => {
    let newValue;
    if (!value) {
      newValue = 0;
    } else {
      newValue = value;
    }
    switch (name){
      case "to":
        console.log(name,"switch case starts from");
        break;
      default:
        console.log(value, "from switch case", newgroups[index - 1]);
        let updatedArr = [...newgroups];
        if(value <= newgroups[index - 1].to || value > newgroups[index - 1].to + 1) {
          console.log("Missing values here")
          updatedArr[index].isError = true
        }else{
          updatedArr[index].isError = false
        }
        dispatch(UpdateGroups(updatedArr))
        
        break;
    }
    const updatedGroups = [...newgroups];
    updatedGroups[index][name] = newValue;
    dispatch(UpdateGroups(updatedGroups))
  };
  const getDataFromApi = async (from, to) =>{
    let dataFromApi = [];
      await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${from - 1}&_end=${to}`).then(result =>{
          return result.json();
        }).then(data => {
          dataFromApi = [...data]
        }).catch(err => console.log(err, "catch errors.."))
    setLoading(false)
    return dataFromApi;

  }

  const checking = () => {
    newgroups.forEach(group =>{
      if(group.from === "" || group.to === "") {
        setIsAllGroupsValid(false);
        return;
      }
      setIsAllGroupsValid(true);
      return;
    })
  }

  useEffect(() =>{
    checking()
  }, [newgroups])
  
  const showAllStatus = () => {
    setLoading(true);
    const updatedGroups = [...newgroups];
    updatedGroups.forEach(async (_val, index) => {
      updatedGroups[index].showCard = !updatedGroups[index].showCard;
      const todosForRange = await getDataFromApi(_val.from, _val.to);
      updatedGroups[index].todos = [...todosForRange];
      
    });
    dispatch(UpdateGroups(updatedGroups))
  };

  const deleteGroup = (index) => {

    let updatedGroups = [...newgroups];
    if(index === 0){
      newgroups[1].from = newgroups[0].from
    }else {
      newgroups[index - 1].to = newgroups[index].to
    }
    updatedGroups.splice(index, 1);
    dispatch(UpdateGroups(updatedGroups))    
  };
  return (
    <div style={{justifyContent:'center',width:'80%'}}>
    <p style={{textAlign:'center',fontSize:20,color:'#000',fontWeight:'bold'}}>Status of Groups</p>
      {newgroups?.map((element, index) => (
        <div style={{display:'flex',justifyContent:'center', marginTop:100}}>
          <Button
          style={{backgroundColor:'red',color:'#fff',marginRight:20,marginTop:10}}
            disabled={newgroups.length === 1}
            onClick={() => {
              deleteGroup(index);
            }}
          >
           Delete
          </Button>
          <p style={{marginRight:5,color:'blue'}}> Group{index + 1} </p>
          <Space direction="horizontal">
            <InputNumber
              min={index === 0 ? 1 : newgroups[index - 1]?.from + 1}
              max={10}
              addonBefore={"From"}
              value={element?.from}
              status={element.isError ? "error": null}
              onChange={(value) => {
                handlValueChange(value, index, "from");
              }}
            />
            <InputNumber
              addonBefore="To"
              min={element?.from}
              max={10}
              value={element?.to}
              onChange={(value) => {
                handlValueChange(value, index, "to");
              }}
            />
            {element.isError ? <div style={{color: "#eb344f"}}>something is overlapping or missing</div>: null}
            {loading ? <>loading ...</>:element.showCard && (
              <Card>
                {element.todos?.map((val) => {
                  return  <>
                      <span>
                        {val.id} {String(val.completed)}{" "}
                      </span>
                    </>
                  
                })}
              </Card>
            )}
          </Space>
          
        </div>
       
      ))}
           <div style={{display:'flex', justifyContent:'center'}}>

       <Button
        style={{marginRight:10,marginTop:'20',backgroundColor:'#ccc',color:'#000',fontWeight:'bold'}}
          disabled={newgroups.length > 9}
          onClick={() => {
            addGroup();
          }}
        >
          + Add Group
        </Button>
        </div>
     <div style={{display:'flex', justifyContent:'right',marginRight:170,marginTop:-40}}>
    
      <Button
      style={{backgroundColor:'#8634eb',color:'#fff',marginTop:20}}
        disabled={!isAllGroupsValid}
        onClick={() => {
          showAllStatus();
        }}
      >
        {newgroups[0].showCard ?"hide status":"Show Status"}
      </Button>
     </div>
    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    newgroups: state.groups

  };
};


export default connect(mapStateToProps)(StatusGroup);
