import React, {useState} from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import axios from 'axios';
import "./Main.css"
import Search from "../components/Search";
import moment from "moment";

type SelectType = {value: string, name: string};

function Main() {
    const devices: SelectType[] = [
        { value: "", name: "설정 안 함" },
        { value: "pc", name: "PC" },
        { value: "mo", name: "Mobile" }
    ];
    const genders: SelectType[]= [
        { value: "", name: "설정 안 함"},
        { value: "m", name: "남성" },
        { value: "f", name: "여성" }
    ]
    const ages: SelectType[] = [
        { value: "", name: "설정 안 함"},
        { value: "10", name: "10대"},
        { value: "20", name: "20대"},
        { value: "30", name: "30대"},
        { value: "40", name: "40대"},
        { value: "50", name: "50대"},
        { value: "60", name: "60대 이상"}
    ]
    const timeUnits: SelectType[] = [
        { value: "date", name: "일간"},
        { value: "week", name: "주간"},
        { value: "month", name: "월간"}
    ]

    const [form, setForm] = useState({
        category: "",
        keyword: "",
    });

    const { category, keyword } :{ category: string; keyword: string; } = form;

    const [startDate, setStartDate] = useState<any>(new Date());
    const [endDate, setEndDate] = useState<any>(new Date());
    const [device, setDevice] = useState<string>("");
    const [age, setAge] = useState<string[]>([])

    const [timeUnit, setTimeunit] = useState<string>("date")
    const [gender, setGender] = useState<string>("")

    //, error -> try, catch
    // YYYY-MM-dd 형식으로 변환
    const newStartDate:string = moment(startDate).format("YYYY-MM-DD")
    const newEndDate:string = moment(endDate).format("YYYY-MM-DD")
    // const newStartDate:string = `${startDate.getFullYear()}-${("0"+(startDate.getMonth()+1)).slice(-2)}-${("0"+startDate.getDate()).slice(-2)}`
    // const newEndDate:string = `${endDate.getFullYear()}-${("0"+(endDate.getMonth()+1)).slice(-2)}-${("0"+endDate.getDate()).slice(-2)}`

    const [DataCheck, setDataCheck] = useState(false);
    const [DateCheck, setDateCheck] = useState(false);
    const [KeyCheck, setKeyCheck] = useState(false)
    const [categoryCheck, setCategoryCheck] = useState(false)

    //API 호출
    const [searchData, setSearchData] = useState<any[]>([]);
    const getShoppingData = async () => {
        const data = {
            "startDate": newStartDate,
            "endDate": newEndDate,
            "timeUnit": timeUnit,
            "category": category,
            "keyword": keyword,
            "device": device,
            "gender": gender,     //radio
            "ages": age         //todo: 체크박스
        };

        const config : any = {
            method: 'post',
            // package.json 파일에 "proxy":"https://openapi.naver.com" 추가 ->  CORS ERROR 방지
            url: '/v1/datalab/shopping/category/keyword/age',
            headers: {
                'X-Naver-Client-Id': 'hxWEKjmbZxVIP1xj0sB0',
                'X-Naver-Client-Secret': 'SZbL1NRx9W',
                'Content-Type': 'application/json'
            },
            data
        };

        axios(config)
            .then(function (response) {
                // 'data' 부분만 전달
                setSearchData(response.data?.results[0]['data']);
                setDataCheck(true)
            })
            .catch(function (error) {
                console.log(error);
                setDataCheck(false)
            });
    };

    //조회 버튼 누르면 api 호출, switch
    const onClick = async() => {
        /*if (keyword === "") setKeyCheck(true)
        else if (category === "") setCategoryCheck(true)*/
        if (newStartDate > newEndDate) setDateCheck(true)
        else await getShoppingData()
    }

    const onChange = (e: any) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    //select 된 값 저장, switch
    const handleClick = (name: string) => (e:any) =>{
        if (name==="device") setDevice(e.target.value)
        else if (name==="age") setAge([...age, e.target.value])
        // age.push(e.target.value)
        else if (name==="gender") setGender(e.target.value)
        else if (name==="timeUnit") setTimeunit(e.target.value)
    };


    return (
        <div id="main">
            <div id={"nav"}>

            </div>

            <div id = "inputBox">
                <div id ="dateForm">
                    <div className="dateTitle">start: </div>
                    <DatePicker
                        className="inputDate"
                        selected={startDate}
                        locale={ko}
                        dateFormat={"yyyy-MM-dd"}
                        onChange={setStartDate}/>
                    <div className="dateTitle">end: </div>
                    <DatePicker
                        className="inputDate"
                        selected={endDate}
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        onChange={setEndDate}/>
                </div>
                <form id = "dataForm">
                    <div className="dataTitle">category:</div>
                    <input className="inputData" placeholder="   category" name="category" value={category} onChange={onChange} />
                    <div className="dataTitle">keyword:</div>
                    <input className="inputData" placeholder="   keyword" name="keyword" value={keyword} onChange={onChange} />
                </form>
            <div id="selectForm">
                <div className="dataTitle">device:</div>
                <select className = "select" onChange={handleClick("device")}>
                    {devices.map((devices) => (
                        <option value={devices.value}>
                            {devices.name}
                        </option>
                    ))}
                </select>
                <div className="dataTitle" >gender:</div>
                <select className = "select" onChange={handleClick("gender")}>
                    {genders.map((genders) => (
                        <option value={genders.value}>
                            {genders.name}
                        </option>
                    ))}
                </select>
                <div className="dataTitle">ages:</div>
                <select className = "select" onChange={handleClick("age")}>
                    {ages.map((ages) => (
                        <option value={ages.value}>
                            {ages.name}
                        </option>
                    ))}
                </select>
                <div className="dataTitle">timeUnit:</div>
                <select
                    className = "select" onChange={handleClick("timeUnit")}>
                    {timeUnits.map((timeUnits) => (
                        <option value={timeUnits.value}>
                            {timeUnits.name}
                        </option>
                    ))}
                </select>
            </div>
                <button id="btnSubmit" onClick={onClick} type="submit">Search</button>
                {DataCheck ? <Search searchData={searchData}/> : null }
                {DateCheck ? <div className="showError">start Date check</div>:null  }
                {/*{KeyCheck ? <div className={"showError"}>keyword check</div>:null  }
                {categoryCheck? <div className={"showError"}>category check</div>:null  }*/}
                {/*age 선택칸 체크박스로 구현 */}
                {/*{ages.map((ages) => (*/}
                {/*    <input type={"checkbox"} name={ages.name}/>*/}
                {/*))}*/}
        </div>
        </div>
    )
}

export default Main;