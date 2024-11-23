"use client";
import axios from "axios";
import styles from "./page.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
axios.defaults.baseURL = "http://localhost:8000";

const generateRandomID = () => {
  return (Math.random() + 1).toString(36).substring(2);
};
export default function Home() {
  const firstRender = useRef(true);
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState(null);
  const deleteData = async (id) => {
    try {
      const resp = await axios.delete(`/${userID}/${id}`);
      console.log("resp", resp.data);
      resp.status === 200 && fetchData();
    } catch (error) {
      console.log("resp", error.response);
    }
  };
  const fetchData = async (id = userID) => {
    try {
      const resp = await axios.get(`/${id}`);
      console.log("resp", resp.data);
      setData(resp.data?.data || []);
    } catch (error) {
      console.log("resp", error.response);
    }
  };
  const addData = async () => {
    try {
      let highlight = prompt("write highlight to add");
      if (highlight) {
        let resp = await axios.post("/add", {
          data: {
            text: highlight,
            id: generateRandomID(),
            orderID: data.length,
          },
          userID,
        });
        if (resp.status === 200) {
          fetchData();
        }
      }
    } catch (error) {}
  };
  const updateData = async ({ id, value }) => {
    try {
      let resp = await axios.put("/update", {
        data: {
          text: value,
          id: id,
          orderID: data.length,
        },
        userID,
      });
      if (resp.status === 200) {
        fetchData();
      }
    } catch (error) {}
  };
  const updateAll = async (val) => {

    try {
      let resp = await axios.put("/update-all", {
        data:val,
        userID,
      });
      setData(val)
      if (resp.status === 200) {
        // fetchData();
      }
    } catch (error) {}
  };

  useEffect(() => {
    //check if we have id in local storage
    let id = localStorage.getItem("id");
    if (!id) {
      //if no then create one
      id = generateRandomID();
      localStorage.setItem("id", id);
    } else {
      fetchData(id);
    }
    setUserID(id);
    //if yes then fetch data from db
  }, []);
  // useEffect(() => {

  //   if (firstRender.current===true) {
  //     firstRender.current = false;
  //   } else {
  //     updateAll();
  //   }
  // }, [JSON.stringify(data)]);
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className="flex align-center">
          <h3 className="m0 text-purple">Property Highlight</h3>{" "}
          <Image
            src="/info-icon.png"
            width={14}
            height={14}
            className="ml-3"
            alt="info"
          />
        </div>
        <button className={styles.button}>
          <h1 className="m0  ">+</h1>
          <span className="ml-4" onClick={addData}>
            Add Highlight
          </span>
        </button>
      </div>
      <div className={styles.list}>
        {data.length>0&&<ReactSortable list={data} setList={updateAll}>
          {data?.map((x) => (
            <div key={x.id}>
              <hr />
              <ListItem
                {...x}
                deleteData={deleteData}
                updateData={updateData}
              />
            </div>
          ))}
        </ReactSortable>}
        {/* {data.length > 0
          ? data?.map((x) => (
              <div key={x.id}>
                <hr />
                <ListItem
                  {...x}
                  deleteData={deleteData}
                  updateData={updateData}
                />
              </div>
            ))
          : "Add highlights"} */}
      </div>
    </div>
  );
}
const ListItem = ({ text = "loremsadjasdas", id, deleteData, updateData }) => {
  const [value, setValue] = useState(text);
  const [isEdit, setIsEdit] = useState(false);
  const update = async () => {
    await updateData({ id, value });
    setIsEdit(false);
  };
  return (
    <div className={styles.listItem}>
      <div className={styles.dragIcon}>
        <Image
          width={15}
          height={15}
          src={"/drag.png"}
          className="pointer"
          alt="drag"
        />
      </div>
      <div className={styles.text}>
        {isEdit ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          value
        )}
      </div>
      <div className={styles.delIcon}>
        {isEdit ? (
          <Image
            width={18}
            height={18}
            src={"/save.png"}
            className="pointer mr-3"
            alt="edit"
            onClick={update}
          />
        ) : (
          <Image
            width={18}
            height={18}
            src={"/edit.png"}
            className="pointer mr-3"
            alt="edit"
            onClick={() => setIsEdit(true)}
          />
        )}
        <Image
          width={18}
          height={18}
          src={"/trash.png"}
          className="pointer"
          alt="trsh"
          onClick={() => deleteData(id)}
        />
      </div>
    </div>
  );
};
