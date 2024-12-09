import React, { useState } from 'react';
import { Input, Select, Avatar, Button, Modal, DatePicker, TimePicker, Checkbox } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DAYS_OF_WEEK, RECURRENCE_TYPES, MEETING_MODEL_TITLE } from '../../../constants';
import dayjs from 'dayjs';
import styles from '../../../styles/_createProject.module.css'
import CancellableList from '../CancellableList';
const { TextArea } = Input;


const url = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

// let daysofweek = [
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//     'Sunday'
// ]

// let Recurrence_types = [
//     'Do not repeat',
//     'Repeat daily',
//     'Repeat weekly',
//     'Repeat monthly',
//     'Repeat yearly',
//     'Custom'
// ]

// let meeting_model_title = [
//     'Add Project Meeting',
//     'Edit Project Meeting'
// ]

function UpdateProject() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modelTitle, setmodelTitle] = useState(MEETING_MODEL_TITLE[0])
    const [createform, setcreateform] = useState({
        project_number:'', project_name:'', categories:[], mep_manager:'', joinery_manager:'', project_start_date:'' ,project_end_date:'' ,no_of_days: 0, project_manager: '', project_coordinator: '', description: '', default_team_members: [], new_team_members: '', new_team_members_result:[], milestoneselect: 'Option 2', milestone_result:[], milestone_name: '',milestone_value:'', emails_result: [], emails: '', phases_result:[], phases:'', calenderobjects:[]
    });
    const [calenderfrom, setcalenderfrom] = useState({
        meeting_name: '',
        meeting_start_date: '',
        meeting_end_date: '',
        meeting_start_time: '',
        meeting_end_time: '',
        meeting_description: '',
        meeting_repeat_type: RECURRENCE_TYPES[0], // Do no repeat
        meeting_every: '',
        meeting_weekly: [],
        meeting_monthly_date_check: true,
        meeting_monthly_date: '1',
        meeting_monthly_dow_check: false,
        meeting_monthly_occurence: '',
        meeting_monthly_dow: '',
    });

    const { project_number, project_name, categories, mep_manager, joinery_manager, project_start_date ,project_end_date ,no_of_days, project_manager, project_coordinator, description, default_team_members, new_team_members, new_team_members_result, milestoneselect, milestone_result, milestone_name,milestone_value, emails_result, emails, phases_result, phases, calenderobjects } = createform;

    const { meeting_name, meeting_start_date, meeting_end_date, meeting_start_time, meeting_end_time, meeting_description, meeting_repeat_type, meeting_every, meeting_weekly, meeting_monthly_date_check, meeting_monthly_date, meeting_monthly_occurence, meeting_monthly_dow_check, meeting_monthly_dow } = calenderfrom;

    const onInputTextChangeHandler = e => setcreateform({...createform, [e.target.name]: e.target.value})

    const onInputTextChangeHandlerCalender = e => setcalenderfrom({...calenderfrom, [e.target.name]: e.target.value})


    const handleChange = (value,type) => {
        if(type === 'categories'){
            setcreateform({...createform, categories: value });
        } else if(type === 'mep_manager'){
            setcreateform({...createform, mep_manager: value });
        }else if(type === 'joinery_manager'){
            setcreateform({...createform, joinery_manager: value });
        }else if(type === 'project_manager'){
            setcreateform({...createform, project_manager: value });
        }else if(type === 'project_coordinator'){
            setcreateform({...createform, project_coordinator: value });
        }else if(type === 'new_team_members'){
            setcreateform({...createform, new_team_members: value });
        }else if(type === 'milestoneselect'){
            setcreateform({...createform, milestoneselect: value });
        }else if(type === 'meeting_repeat_type'){
            setcalenderfrom({...calenderfrom, meeting_repeat_type: value });
        }else if(type === 'meeting_monthly_date'){
            setcalenderfrom({...calenderfrom, meeting_monthly_date: value });
        }else if(type === 'meeting_monthly_occurence'){
            setcalenderfrom({...calenderfrom, meeting_monthly_occurence: value });
        }else if(type === 'meeting_monthly_dow'){
            setcalenderfrom({...calenderfrom, meeting_monthly_dow: value });
        }
    };

    const onSearch = (value) => {
        // console.log('search:', value);
    };
      
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleOnCancelClick = (value) =>{
        console.log(value);
    }

    const showModal = (param,name) => {
        setmodelTitle(param);
        if(param === MEETING_MODEL_TITLE[1]){
            setcalenderfrom(...calenderobjects.filter(item=>item.meeting_name === name))
        }
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if(meeting_name === '') return;
        // add items to array
        if(modelTitle === MEETING_MODEL_TITLE[0] && calenderobjects.filter(item=>item.meeting_name === calenderfrom.meeting_name).length === 0){
            setcreateform({...createform, calenderobjects: [...calenderobjects, calenderfrom]});
        } else if(modelTitle === MEETING_MODEL_TITLE[1] && calenderobjects.filter(item=>item.meeting_name === calenderfrom.meeting_name).length === 1){
            setcreateform({...createform, calenderobjects: [...calenderobjects.filter(item=>item.meeting_name !== calenderfrom.meeting_name),calenderfrom]});
        }
        // clear the form
        setcalenderfrom({
            meeting_name: '',
            meeting_start_date: '',
            meeting_end_date: '',
            meeting_start_time: '',
            meeting_end_time: '',
            meeting_description: '',
            meeting_repeat_type: RECURRENCE_TYPES[0], // Do no repeat
            meeting_every: '',
            meeting_weekly: [],
            meeting_monthly_date_check: true,
            meeting_monthly_date: '1',
            meeting_monthly_dow_check: false,
            meeting_monthly_occurence: '',
            meeting_monthly_dow: '',
        })
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setcalenderfrom({
            meeting_name: '',
            meeting_start_date: '',
            meeting_end_date: '',
            meeting_start_time: '',
            meeting_end_time: '',
            meeting_description: '',
            meeting_repeat_type: RECURRENCE_TYPES[0], // Do no repeat
            meeting_every: '',
            meeting_weekly: [],
            meeting_monthly_date_check: true,
            meeting_monthly_date: '1',
            meeting_monthly_dow_check: false,
            meeting_monthly_occurence: '',
            meeting_monthly_dow: '',
        })
    };

    const onChangeDate = (date, dateString, type) => {
        if(type === 'project_start_date'){
            setcreateform({...createform, project_start_date: dateString })
        } else if(type === 'project_end_date'){
            setcreateform({...createform, project_end_date: dateString })
        } else if(type === 'meeting_start_date'){
            setcalenderfrom({...calenderfrom, meeting_start_date: dateString })
        } else if(type === 'meeting_end_date'){
            setcalenderfrom({...calenderfrom, meeting_end_date: dateString })
        }
    };

    const onChangeTime = (time, timeString, type) => {
        if(type === 'meeting_start_time'){
            setcalenderfrom({...calenderfrom, meeting_start_time: timeString })
        } else if(type === 'meeting_end_time'){
            setcalenderfrom({...calenderfrom, meeting_end_time: timeString })
        }
    };


    const onhandleAddEvent = (value,type) =>{
        if(value.trim() == '') return;
        if(type=== 'new_team_members' && !new_team_members_result.includes(value)){
            // (id,name,image_url)
            setcreateform({...createform, new_team_members:'', new_team_members_result:[...new_team_members_result,value]})
        }else if(type=== 'emails' && !emails_result.includes(value)){
            setcreateform({...createform, emails:'', emails_result:[...emails_result,value]})
        }else if(type=== 'phases' && !phases_result.includes(value)){
            setcreateform({...createform, phases:'', phases_result:[...phases_result,value]})
        }
    }

    const onhandleAddMilestone = (milestone_name,milestone_value,type)=> {
        if(milestone_name.trim() == '') return;
        if(type=== 'milestone' && milestone_result.filter(item=> item.name === milestone_name).length === 0){
            // {name,value}
            setcreateform({...createform, milestone_result:[...milestone_result,{name:milestone_name,value: milestone_value||0}]})
        }
    }

    const onhandleCancelEvent = (value,type) =>{
        if(value.trim() == '') return;

        if(type === 'new_team_members'){
            setcreateform({...createform, new_team_members_result:[...new_team_members_result.filter(item => item !== value)]})
        }else if(type === 'emails'){
            setcreateform({...createform, emails_result:[...emails_result.filter(item => item !== value)]})
        }else if(type=== 'phases'){
            setcreateform({...createform, phases_result:[...phases_result.filter(item => item !== value)]})
        }else if(type=== 'milestone'){
            setcreateform({...createform, milestone_result:[...milestone_result.filter(item => item.name !== value)]})
        }else if(type=== 'create_meetings'){
            setcreateform({...createform, calenderobjects:[...calenderobjects.filter(item => item.meeting_name !== value)]})
        }
        
    }


    const onWeeklyCheckChange = (e,value) => {
        if(e.target.checked){
            //add
            setcalenderfrom({...calenderfrom, meeting_weekly: [...meeting_weekly,value] })
        }else{
            //remove
            setcalenderfrom({...calenderfrom, meeting_weekly: [...meeting_weekly.filter(item => item !== value)] })
        }
    };

    const onMonthlyCheckChange = (e,value) => {
        //add
        if(value ==='day_field' && e.target.checked){
            setcalenderfrom({...calenderfrom, meeting_monthly_dow_check: true, meeting_monthly_date_check: false })
        }else{
            setcalenderfrom({...calenderfrom, meeting_monthly_dow_check: false, meeting_monthly_date_check: true })
        }
    };
      
    return (

        <div style={{width:'100%',height:'100%'}}>
        
        <h1>Update Create</h1>
        <div style={{textAlign:'right',margin:'20px'}}>
            <Button type={'default'} onClick={(e) => {navigate(`${ROUTES.PROJECTS.PATH}`)}} style={{marginRight:'10px'}}>Cancel</Button>
            <Button type={'primary'} onClick={(e) => {navigate(`${ROUTES.PROJECTS.PATH}`)}}>Save</Button>
        </div>
            <div style={{width: '100%', height: '80%', overflowY:'scroll',paddingBottom:'20px'}}>
            
                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Project Number</div>
                        <div>
                            <Input placeholder="" name={'project_number'} value={project_number} onChange={(e) => onInputTextChangeHandler(e)} />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Project Name</div>
                        <div>
                            <Input placeholder="" name={'project_name'} value={project_name} onChange={(e) => onInputTextChangeHandler(e)} />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Category</div>
                        <div>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select"
                                value={categories}
                                onChange={(value) => handleChange(value,'categories')}
                                options={[
                                    {
                                        label: 'Category 1',
                                        value: 'Category 1'
                                    },
                                    {
                                        label: 'Category 2',
                                        value: 'Category 2'
                                    },
                                    {
                                        label: 'Category 3',
                                        value: 'Category 3'
                                    },
                                    {
                                        label: 'Category 4',
                                        value: 'Category 4'
                                    }
                                ]}
                                />
                        </div>
                    </div>

                </div>

                {/*  dates */}
                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                    <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Select MEP Manager</div>
                        <div>
                            <Select
                                style={{width:'100%'}}
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                value={mep_manager}
                                onChange={(value) => handleChange(value,'mep_manager')}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                                ]}
                            />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Select Joinery Manager</div>
                        <div>
                            <Select
                                style={{width:'100%'}}
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                value={joinery_manager}
                                onChange={(value) => handleChange(value,'joinery_manager')}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* end dates */}


                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Start Date</div>
                        <div style={{width:'100%'}}>
                            <DatePicker value={dayjs(project_start_date||'2024-01-01', 'YYYY-MM-DD')} onChange={(date, dateString) => onChangeDate(date, dateString, 'project_start_date')} style={{width:'100%'}} />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>End Date</div>
                        <div style={{width:'100%'}}>
                            <DatePicker value={dayjs(project_end_date||'2024-31-01', 'YYYY-MM-DD')} onChange={(date, dateString) => onChangeDate(date, dateString, 'project_end_date')} style={{width:'100%'}} />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'29%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>No. of days</div>
                        <div>
                            <Input placeholder="" name={'no_of_days'} value={no_of_days} onChange={(e) => onInputTextChangeHandler(e)} />
                        </div>
                    </div>

                </div>

                {/* description */}
                <div style={{width:'100%',padding:'20px'}}>
                    <div className={styles.subsectionfont}>Description</div>
                    <TextArea
                        value={description}
                        name={'description'}
                        title={'description'}
                        onChange={(e) => onInputTextChangeHandler(e)}
                        placeholder=""
                        autoSize={{
                        minRows: 3,
                        maxRows: 5,
                        }}
                    />
                </div>

                {/* pm and pc */}
                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                   
                    <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Assign Project Manager</div>
                        <div>
                            <Select
                                style={{width:'100%'}}
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                value={project_manager}
                                onChange={(value) => handleChange(value,'project_manager')}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                                ]}
                            />
                        </div>
                    </div>

                    <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Assign Project Coordinator</div>
                        <div>
                            <Select
                                style={{width:'100%'}}
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                value={project_coordinator}
                                onChange={(value) => handleChange(value,'project_coordinator')}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                                ]}
                            />
                        </div>
                    </div>

                </div>


                {/* team */}
                <div className={styles.subsectionfont} style={{ margin:'20px 20px 0 20px'}}>Team member</div>
                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap', border: '0.2px solid #aaa', borderRadius: '5px',margin:'0 20px'}}>
                   

                   <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                       <div className={styles.subsectionfont}>Default Team Members</div>          
                        <CancellableList 
                            leftSideItem={<>  
                                <div style={{margin:'10px'}}><Avatar src={url} /></div>
                                <div>Name/Designation</div>
                            </>} 
                            rightSideItem={null}
                            clickfuntion={handleOnCancelClick}
                        />

                        <CancellableList 
                            leftSideItem={<>  
                                <div style={{margin:'10px'}}><Avatar src={url} /></div>
                                <div>Name/Designation</div>
                            </>} 
                            rightSideItem={null}
                            clickfuntion={handleOnCancelClick}
                        />

                        <CancellableList 
                            leftSideItem={<>  
                                <div style={{margin:'10px'}}><Avatar src={url} /></div>
                                <div>Name/Designation</div>
                            </>} 
                            rightSideItem={null}
                            clickfuntion={handleOnCancelClick}
                        />
                      
                   </div>

                   <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                       <div className={styles.subsectionfont}>Add Team members</div>
                        <div style={{width:'100%'}}>
                            <div style={{display:'flex'}}>
                                <Select
                                    style={{width:'100%'}}
                                    showSearch
                                    placeholder=""
                                    optionFilterProp="children"
                                    value={new_team_members}
                                    onChange={(value) => handleChange(value,'new_team_members')}
                                    onSearch={onSearch}
                                    filterOption={filterOption}
                                    allowClear
                                    options={[
                                    {
                                        value: 'jack',
                                        label: 'Jack',
                                    },
                                    {
                                        value: 'lucy',
                                        label: 'Lucy',
                                    },
                                    {
                                        value: 'tom',
                                        label: 'Tom',
                                    },
                                    ]}
                                />
                                <Button onClick={()=>onhandleAddEvent(new_team_members,'new_team_members')}><PlusOutlined /></Button>
                            </div>

                            {
                                new_team_members_result && new_team_members_result.map((item,index)=>(
                                    <CancellableList 
                                        key={index}
                                        leftSideItem={<>  
                                            <div style={{margin:'10px'}}><Avatar src={url} /></div>
                                            <div>{item}</div>
                                        </>} 
                                        rightSideItem={<CloseCircleOutlined className={styles.darkgrayfont}/>}
                                        clickfuntion={onhandleCancelEvent}
                                        value={item}
                                        type={'new_team_members'}
                                    />
                                ))
                            }
                       </div>
                   </div>

               </div>


                {/* create payment */}
                <div className={styles.subsectionfont} style={{ margin:'20px 20px 0 20px'}}>Add Payment Milestones</div>
                <div style={{ margin:'0 20px',border: '0.2px solid #aaa', borderRadius: '5px', padding:'20px'}}>
                    <div className={styles.subsectionfont}>Select Milestones</div>
                    <div>
                        <Select
                            style={{width:'100%'}}
                            showSearch
                            placeholder=""
                            value={milestoneselect}
                            optionFilterProp="children"
                            onChange={(value) => handleChange(value,'milestoneselect')}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                            {
                                value: 'Option 1',
                                label: 'Option 1',
                            },
                            {
                                value: 'Option 2',
                                label: 'Option 2',
                            }
                            ]}
                        />
                    </div>

                    {/*  */}
                    <div className={styles.subsectionContainer} style={{justifyContent:'space-between',alignItems:'flex-start'}}>

                        <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                        <div className={styles.subsectionfont}>Milestone Name</div>
                        <div style={{width:'100%'}}>
                            <div style={{display:'flex'}}>
                                <Input placeholder={'name'} name={'milestone_name'} value={milestone_name} onChange={(e) => onInputTextChangeHandler(e)} />
                                <Button onClick={()=>onhandleAddMilestone(milestone_name,milestone_value,'milestone')}><PlusOutlined /></Button>
                            </div>


                            {
                                milestone_result && milestone_result.map((item,index)=>(
                                    <CancellableList 
                                        leftSideItem={<>  
                                            <div>{item.name}</div>
                                        </>} 
                                        rightSideItem={<CloseCircleOutlined className={styles.darkgrayfont}/>}
                                        clickfuntion={onhandleCancelEvent}
                                        value={item.name}
                                        type={'milestone'}
                                        key={index}
                                    />
                                ))
                            }
                        </div>
                        </div>

                        { milestoneselect === 'Option 2' && <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'20px'}}>
                            <div className={styles.subsectionfont}>Percentage of Completion</div>
                                <div style={{width:'100%'}}>
                                    <div style={{display:'flex'}}>
                                    <Input placeholder={'percentage'} name={'milestone_value'} value={milestone_value} onChange={(e) => onInputTextChangeHandler(e)} />
                                    </div>
                                    {
                                        milestone_result && milestone_result.map((item,index)=>(
                                            <CancellableList 
                                                leftSideItem={<>  
                                                    <div>{item.value} %</div>
                                                </>} 
                                                rightSideItem={null}
                                                clickfuntion={onhandleCancelEvent}
                                                value={item.value}
                                                type={'milestone'}
                                                key={index}
                                            />
                                        ))
                                    }
                            </div>
                        </div> }
                
                    </div>

                    <div className={styles.subsectionContainer} style={{justifyContent:'space-between',alignItems:'flex-start'}}>
                        
                        <div style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'8px 10px'}}> 
                            <div className={styles.subsectionfont}>Email</div>
                            <div style={{display:'flex'}}>
                                <Input placeholder={'name'} name={'emails'} value={emails} onChange={(e) => onInputTextChangeHandler(e)} />
                                <Button onClick={()=>onhandleAddEvent(emails,'emails')}><PlusOutlined /></Button>
                            </div>
                        </div>

                        {
                            emails_result && emails_result.map((item,index)=>(
                                <div key={index} style={{width:'100%',minWidth:'45%',maxWidth:'350px', margin:'8px 10px'}}>
                                    <CancellableList 
                                        leftSideItem={<>  
                                            <div>{item}</div>
                                        </>} 
                                        rightSideItem={<CloseCircleOutlined className={styles.darkgrayfont}/>}
                                        clickfuntion={onhandleCancelEvent}
                                        value={item}
                                        type={'emails'}
                                    />
                                </div>
                            ))
                        }
                    </div>
               </div>

                {/* create phase */}
                <div className={styles.subsectionfont} style={{ margin:'20px 20px 0 20px'}}>Create Phase</div>
                   <div style={{ margin:'0 20px',border: '0.2px solid #aaa', borderRadius: '5px', padding:'20px'}}>
                       <div className={styles.subsectionfont}>Phase Name</div>
                       <div style={{width:'100%'}}>
                        <div style={{display:'flex'}}>
                            <Input placeholder={'title'} name={'phases'} value={phases} onChange={(e) => onInputTextChangeHandler(e)} />
                            <Button onClick={()=>onhandleAddEvent(phases,'phases')}><PlusOutlined /></Button>
                            
                        </div>
                        {
                            phases_result && phases_result.map((item,index)=>(
                                <CancellableList 
                                    leftSideItem={<>  
                                        <div>{item}</div>
                                    </>} 
                                    rightSideItem={<CloseCircleOutlined className={styles.darkgrayfont}/>}
                                    clickfuntion={onhandleCancelEvent}
                                    value={item}
                                    type={'phases'}
                                    key={index}
                                />
                            ))
                        }       
                    </div>
               </div>



               {/* create meetings */}
               <div className={styles.subsectionfont} style={{ margin:'20px 20px 0 20px'}}>Create Meetings</div>
                   <div style={{ margin:'0 20px',border: '0.2px solid #aaa', borderRadius: '5px', padding:'20px'}}>
                       <div style={{width:'100%'}}>
                        <div style={{textAlign:'right',padding:'10px'}}>
                            <Button onClick={()=>showModal(MEETING_MODEL_TITLE[0])}><PlusOutlined /> Add</Button>

                            <Modal title={modelTitle} open={isModalOpen} onOk={handleOk} okText="Save" onCancel={handleCancel}>
                                <div style={{padding:'10px'}}>
                                    <div style={{margin:'10px'}}>
                                        <div>Meeting Name</div>
                                        <Input disabled={modelTitle === MEETING_MODEL_TITLE[1]} name={'meeting_name'} value={meeting_name} 
                                            onChange={(e) => onInputTextChangeHandlerCalender(e)} />
                                    </div>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap',padding:'10px 0'}}>
                                        <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around', width:'45%'}}>
                                            <div>Start date</div>
                                            <DatePicker 
                                            value={dayjs(meeting_start_date||'2024-01-01', 'YYYY-MM-DD')}
                                             onChange={(date, dateString) => onChangeDate(date, dateString, 'meeting_start_date')} style={{width:'100%',minWidth:'80%'}}/>
                                        </div>
                                        <div style={{display:'flex',flexDirection:'column', width:'45%'}}>
                                            <div>End date</div>
                                            <DatePicker value={dayjs(meeting_end_date||'2024-01-01', 'YYYY-MM-DD')} onChange={(date, dateString) => onChangeDate(date, dateString, 'meeting_end_date')} style={{width:'100%',minWidth:'80%'}}/>
                                        </div>
                                    </div>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap',padding:'10px 0'}}>
                                        <div style={{display:'flex',flexDirection:'column', width:'45%'}}>
                                            <div>Start time</div>
                                            <div><TimePicker value={dayjs(meeting_start_time||'12:08', 'HH:mm')} 
                                            // defaultValue={dayjs('12:08', 'HH:mm')}
                                             style={{width:'100%',minWidth:'80%'}} onChange={(time, timeString) => onChangeTime(time, timeString, 'meeting_start_time')} /></div>
                                        </div>
                                        <div style={{display:'flex',flexDirection:'column', width:'45%'}}>
                                            <div>End time</div>
                                            <div><TimePicker 
                                            value={dayjs(meeting_end_time||'12:08', 'HH:mm')}
                                            // defaultValue={dayjs('12:08', 'HH:mm')}
                                             style={{width:'100%',minWidth:'80%'}} onChange={(time, timeString) => onChangeTime(time, timeString, 'meeting_end_time')} /></div>
                                        </div>
                                    </div>

                                   

                                    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',padding:'10px'}}>
                                        <div className={styles.subsectionfont}>Recurrence</div>
                                        <div>
                                            <Select
                                                style={{width:'100%'}}
                                                showSearch
                                                placeholder=""
                                                value={meeting_repeat_type}
                                                onChange={(value) => handleChange(value,'meeting_repeat_type')}
                                                optionFilterProp="children"
                                                onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={
                                                    RECURRENCE_TYPES.map(item=>{
                                                        return {value:item,label:item}
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* WEEKLY */}
                                    {
                                        meeting_repeat_type === RECURRENCE_TYPES[2] && (
                                            <div style={{padding:'10px'}}>
                                                <div>Weekly on</div>
                                                {
                                                    DAYS_OF_WEEK.map((item,index)=>(
                                                        <div style={{margin:'10px 0'}} key={index}>
                                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                                <div style={{marginRight:'10px'}}><Checkbox onChange={e=>onWeeklyCheckChange(e,item)} /></div>
                                                                <div>{item}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    

                                    {/* Monthly or yearly checkbox */}
                                    {
                                        ((meeting_repeat_type === RECURRENCE_TYPES[3]) || (meeting_repeat_type === RECURRENCE_TYPES[4])) && (
                                            <>
                                    <div style={{padding:'10px', width:'100%'}}>
                                        <div style={{display:'flex',flexDirection:'row', alignItems:'center', width:'100%'}}>
                                            <div style={{marginRight:'10px'}}><Checkbox checked={meeting_monthly_date_check} onChange={e=>onMonthlyCheckChange(e,'date_field')}/></div>
                                            <div style={{marginRight:'10px'}}>
                                            <Select
                                                style={{width:'100%'}}
                                                showSearch
                                                placeholder=""
                                                value={meeting_monthly_date}
                                                optionFilterProp="children"
                                                onChange={(value) => handleChange(value,'meeting_monthly_date')}
                                                onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={
                                                    Array.from({ length: 31 }, (_, i) => i + 1).map(date=>{
                                                        return {value:date,label:date}
                                                    })
                                                }
                                            />
                                            </div>
                                            <div>day</div>
                                        </div>
                                    </div>

                                    <div style={{padding:'10px', width:'100%'}}>
                                        <div style={{display:'flex',flexDirection:'row', alignItems:'center', width:'100%'}}>
                                            <div style={{marginRight:'10px'}}><Checkbox checked={meeting_monthly_dow_check} onChange={e=>onMonthlyCheckChange(e,'day_field')} /></div>
                                            <div style={{marginRight:'10px',width:'90px'}}>
                                            <Select
                                                style={{width:'100%'}}
                                                showSearch
                                                placeholder=""
                                                value={meeting_monthly_occurence}
                                                optionFilterProp="children"
                                                onChange={(value) => handleChange(value,'meeting_monthly_occurence')}
                                                onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={
                                                   [
                                                    {
                                                        value: 'First',
                                                        label: 'First'
                                                    },
                                                    {
                                                        value: 'Second',
                                                        label: 'Second'
                                                    },
                                                    {
                                                        value: 'Third',
                                                        label: 'Third'
                                                    },
                                                    {
                                                        value: 'Four',
                                                        label: 'Four'
                                                    }
                                                   ]
                                                }
                                            />
                                            </div>
                                            <div style={{width:'120px'}}>
                                                <Select
                                                    style={{width:'100%'}}
                                                    showSearch
                                                    placeholder=""
                                                    value={meeting_monthly_dow}
                                                    optionFilterProp="children"
                                                    onChange={(value) => handleChange(value,'meeting_monthly_dow')}
                                                    onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={
                                                        DAYS_OF_WEEK.map((item,index)=>{
                                                            return {value:item,label:item}
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                        )
                                    }

                                    <div style={{padding:'10px'}}>
                                        <div className={styles.subsectionfont}>Description</div>
                                        <TextArea
                                            name={'meeting_description'} 
                                            value={meeting_description} 
                                            onChange={(e) => onInputTextChangeHandlerCalender(e)}
                                            placeholder=""
                                            autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                            }}
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div>

                        {
                            calenderobjects.map((item,index)=>(
                                <CancellableList
                                    leftSideItem={<>  
                                        <div style={{cursor:'pointer'}} onClick={()=>showModal(MEETING_MODEL_TITLE[1],item?.meeting_name)}>{item.meeting_name}</div>
                                    </>} 
                                    rightSideItem={
                                    <CloseCircleOutlined className={styles.darkgrayfont}/>
                                    }
                                    clickfuntion={onhandleCancelEvent}
                                    value={item.meeting_name}
                                    type={'create_meetings'}
                                    key={index}
                                />
                            ))
                        }      
                    </div>
               </div>

            </div>
        </div>
    )
}

export default UpdateProject
