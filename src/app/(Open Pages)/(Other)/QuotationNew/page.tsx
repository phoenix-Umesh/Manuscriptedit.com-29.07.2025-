"use client";

import { useEffect, useState, useRef } from "react";
import "../QuotationNew/quotationNew.css";
import { goalOptions } from "@/app/utils/Quote";
import { addOnOptions } from "@/app/utils/Quote";
import { addonturnaroundPrice } from "@/app/utils/Quote";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import captchaImg1 from "../../../../../public/assets/captcheImages/22d5n.png";
import captchaImg2 from "../../../../../public/assets/captcheImages/2356g.png";
import captchaImg3 from "../../../../../public/assets/captcheImages/25257.png";
import captchaImg4 from "../../../../../public/assets/captcheImages/25p2m.png";
import captchaImg5 from "../../../../../public/assets/captcheImages/2cegf.png";
import Link from "next/link";
import SignUpAgreement from "./SignUpAgreement";
import {
  subjectsData,
  majorSubject,
  addOnsId,
  subServices,
  mainServices,
  goals,
  turnaroundPrices2,
  turnaroundPrices1,
  turnaroundPrices,
} from "./dataObjects";

export default function ProjectQuote() {
  const [selectedGoal, setSelectedGoal] = useState<any>("");
  const [hideGoalSection, setHideGoalSection] = useState<any>(true);
  const [selectedOption, setSelectedOption] = useState<any>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState<any>("");
  const [turnaround, setTurnaround] = useState<string>("Trn_Ar10");
  const [totalPrice, setTotalPrice] = useState<any>(0);
  const [totalPriceAddons, setTotalPriceAddOns] = useState<any>(0);
  const [optionTotalPrice, setOptionTotalPrice] = useState<any>(0);
  const [manualWordCount, setManualWordCount] = useState<any>("");
  const [selectedAddOnsId, setSelectedAddOnsId] = useState<any>("");
  // const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>("");
  const [valFromLocalStorage, setValFromLocalStorage] = useState<any>("");
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [captchaName, setCaptchaName] = useState("");
  const [captchaImage, setCaptchaImage] = useState(captchaImg3);
  const [captchaCode, setCaptchaCode] = useState("25257");
  let [changeCaptcha, setChangeCaptcha] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  console.log("Country:1", countries);

  type Country = {
    id: string;
    country: string;
  };

useEffect(() => {
  fetch("https://secure.manuscriptedit.com/api/get_all_country_list.php")
    .then((response) => response.json())
    .then((data: any) => {
      console.log("Fetched Country Data:", data); // ✅ should be an array
      setCountries(data); // ✅ directly set the array
    })
    .catch((error) => {
      console.error("Error fetching country list:", error);
    });
}, []);


  
  const captchaObj = [
    { image: captchaImg1, code: "22d5n" },
    { image: captchaImg2, code: "2356g" },
    { image: captchaImg3, code: "25257" },
    { image: captchaImg4, code: "25p2m" },
    { image: captchaImg5, code: "2cegf" },
  ];
  let randomNumber;

  useEffect(() => {
    randomNumber = Math.floor(Math.random() * 5);
    setCaptchaImage(captchaObj[randomNumber].image);
    setCaptchaCode(captchaObj[randomNumber].code);
    console.log(captchaName);
  }, [changeCaptcha]);

  const disAgreed = (e: any) => {
    setShowModal(false);
    setIsChecked(false);
  };

  const handleCheckboxChange = (e: any) => {
    if (e.target.checked) {
      setShowModal(true);
    }
  };
  console.log(
    "totalPrice",
    totalPrice,
    "totalPriceAddons",
    totalPriceAddons,
    "optionTotalPrice",
    optionTotalPrice,
    "selectedAddOns",
    selectedAddOns
  );

  useEffect(() => {
    setValFromLocalStorage(
      localStorage.getItem("SelectedServiceFromPriceCalculator")
    );
    setWordCount(localStorage.getItem("SelectedWordCountFromPriceCalculator"));
  }, []);
  // console.log("wordCount is:", wordCount);d
  useEffect(() => {
    if (valFromLocalStorage === "Extensive Substantive Editing") {
      setSelectedGoal("Editing & Language Services");
    } else if (valFromLocalStorage === "Substantive Editing") {
      setSelectedGoal("Editing & Language Services");
    } else if (valFromLocalStorage === "Proofreading") {
      setSelectedGoal("Editing & Language Services");
    }
  }, [valFromLocalStorage]);

  useEffect(() => {
    setTimeout(() => setSelectedOption(valFromLocalStorage), 100);
  }, [valFromLocalStorage]);

  // console.log("afterUseEffect", valFromLocalStorage);

  useEffect(() => {
    setSelectedAddOns([]);
  }, [selectedOption]);

  useEffect(() => {
    const numericWordCount = Number(wordCount);
    let basePrice = 0;

    if (selectedOption === "Extensive Substantive Editing") {
      basePrice = numericWordCount * (turnaroundPrices[turnaround] || 0);
    } else if (selectedOption === "Substantive Editing") {
      basePrice = numericWordCount * (turnaroundPrices1[turnaround] || 0);
    } else if (selectedOption === "Proofreading") {
      basePrice = numericWordCount * (turnaroundPrices2[turnaround] || 0);
    } else if (selectedOption === "Standard Package") {
      basePrice = 200; // Replace with your actual fixed price
    } else if (selectedOption === "Advanced Package") {
      basePrice = 350; // Replace with your actual fixed price
    } else if (selectedOption === "Premium Publication Package") {
      basePrice = 500; // Replace with your actual fixed price
    }

    // Calculate add-on total individually
    const addOnTotal = selectedAddOns.reduce((total, addOn) => {
      const matchedAddOn = addonturnaroundPrice.find(
        (item) => item.name === addOn
      );

      console.log("check this out", matchedAddOn);
      if (matchedAddOn) {
        if (matchedAddOn.price < 1) {
          return total + numericWordCount * matchedAddOn.price;
        } else {
          return total + matchedAddOn.price;
        }
      }
      return total;
    }, 0);

    console.log("the base price", basePrice);

    setTotalPrice(basePrice);
    setTotalPriceAddOns(addOnTotal);
    setOptionTotalPrice(basePrice + addOnTotal);
  }, [wordCount, turnaround, selectedAddOns, selectedOption]);
  const AddonCommonPrice = 0.1;

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    PhoneNum: "",
    HearAbt: "",
    country: "",
    majorSubject: "",
    specificSubject: "",
    deliveryDate: "",
    preferredLanguage: "",
    editorInstruction: "",
    paymentMode: "",
  });
  // console.log(addOns[selectedGoal][selectedAddOns[1]])
  for (let i = 0; i < selectedAddOns.length; i++) {
    let j = selectedAddOns[i];
    // console.log(addOns[selectedGoal][j]);
  }

  useEffect(() => {
    const optionPrice =
      goalOptions[selectedGoal]?.find((opt: any) => opt.text === selectedOption)
        ?.price || 0;

    const addOnsTotal = addOnOptions[selectedOption]
      ? addOnOptions[selectedOption]
          .filter((addOn: any) => selectedAddOns.includes(addOn.text))
          .reduce((sum: any, addOn: any) => sum + (addOn.price || 0), 0)
      : 0;
  }, [selectedGoal, selectedOption, selectedAddOns]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setSelectedOption("");
    setSelectedAddOns([]);
  }, [selectedGoal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const mapServiceType = (goal: string): string => {
    // Map the selected goal to the corresponding service_type value
    const goalToServiceType: Record<string, string> = {
      "Editing & Language Services": "1",
      "Medical & Clinical Writing Services": "2",
      "Regulatory Writing Support": "3",
      "Scientific Communication Support": "4",
      "Evidence Synthesis & Review Writing": "5",
      "Scientific Publication Assistance": "6",
      "Data & Statistical Support": "7",
      "Journal Publication Support": "8",
      "Manuscriptedit Packages": "9",
      "Academic & Non-Scientific Writing": "10",
      "Design and Image Polishing and Creation": "11",
    };
    return goalToServiceType[goal] || "0";
  };

  useEffect(() => {
    let allSelectedAddOnsId = selectedAddOns.map(
      (val) => (addOnsId as any)[selectedGoal][val]
    );
    const allSelectedAddOnsIds = allSelectedAddOnsId.join(",");
    setSelectedAddOnsId(allSelectedAddOnsIds);
  }, [selectedAddOns]);

  const handleSubmit = async (
    e: React.FormEvent,
    selectedGoal: any,
    mainServices: any,
    subServices: any,
    selectedOption: any
  ) => {
    e.preventDefault();
    if (captchaName !== captchaCode) {
      setChangeCaptcha(!changeCaptcha);
      setCaptchaName("");
      alert(
        "Please enter the captcha carefully. CAPTCHA doesn't match.Try Again!"
      );

      return;
    }

    if (!isChecked) {
      e.preventDefault();
      alert("Please agree to the terms before proceeding.");
      return;
    }
    // Prepare the data in the required format
    // mapMajorSubject(formData.majorSubject)
    const postData = {
      service_type: mainServices[selectedGoal],
      service_name: subServices[selectedOption],
      add_ons: selectedAddOnsId,
      major_subject: formData.majorSubject,
      specific_subject: formData.specificSubject,
      delivery_date: formData.deliveryDate,
      language: formData.preferredLanguage.toLowerCase().replace(" ", "_"),
      inst_for_editor: formData.editorInstruction,
      word_count: wordCount || "0",
      pay_mode: formData.paymentMode,
      file: file ? file.name : "no_file_uploaded.docs",
      name: formData.Name,
      email: formData.Email,
      phone: formData.PhoneNum,
      user_find: formData.HearAbt,
      total_price: String(optionTotalPrice),
      country: formData.country,
    };

    // 2. After successful submission — RESET EVERYTHING:
    // setSelectedGoal("");
    // setSelectedOption("");
    // setSelectedAddOns([]);
    // setWordCount("");
    // setFile(null);
    // setTurnaround("Trn_Ar10"); // or your default turnaround
    // setFormData({
    //   Name: "",
    //   Email: "",
    //   PhoneNum: "",
    //   HearAbt: "",
    //   country:"",
    //   majorSubject: "",
    //   specificSubject: "",
    //   deliveryDate: "",
    //   preferredLanguage: "",
    //   editorInstruction: "",
    //   paymentMode: "",
    // });
    setHideGoalSection(false); // to show the goal options again

    // console.log("Submitting data:", postData);

    try {
      const response = await fetch(
        "https://secure.manuscriptedit.com/api/submit_quotation_out.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error submitting quotation: ${response.statusText}`);
      }

      const { Message } = await response.json();
      if (Message === "Data Saved Successfully") {
        alert("Quotation submitted successfully!");
        window.location.href = "https://manuscriptedit.com/AuthorDashboard/";
      } else {
        alert("Something went wrong with the submission.");
      }
    } catch (err: any) {
      console.error("Error encountered:", err.message);
      alert(
        "Error encountered while submitting the Quotation. Please try again."
      );
    }
  };

  useEffect(() => {
    setHideGoalSection(!hideGoalSection);
  }, [selectedGoal]);

  return (
    <div className="container">
      <div className="row mt-4 ">
        <div className="col-md-8 p-4 border bg-light shade">
          <div>
            <h5>
              <strong>Submit your project details for an exact quote.</strong>
            </h5>
            <div className="uploadContainer">
              <div className="row Alignments">
                <div className="col-lg-4">
                  <strong>
                    <p style={{ marginBottom: "0px" }}>
                      Enter the word count *
                    </p>
                  </strong>
                </div>

                <div className="col-lg-7">
                  <input
                    type="number"
                    name="wordCount"
                    className="form-control"
                    placeholder="Enter word count *" // <-- set a placeholder text or leave it blank
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row Alignments">
                <div className="col-lg-4">
                  <strong>
                    <p style={{ marginBottom: "0px" }}>Turn Around Time *</p>
                  </strong>
                </div>

                <div className="col-lg-7">
                  <select
                    className="form-control"
                    name="WrdCnt"
                    id="WrdCnt"
                    style={{ marginTop: "10px" }}
                    value={turnaround}
                    onChange={(e) => setTurnaround(e.target.value)}
                  >
                    <option value="Trn_Ar10">10days</option>
                    <option value="Trn_Ar5">5days</option>
                    <option value="Trn_Ar3">3days</option>
                    <option value="Trn_Ar2">2days</option>
                    <option value="Trn_Ar1">1day</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "2rem",
                display: hideGoalSection ? "" : "none",
                border: "1px solid rgb(55, 151, 188)",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              <button
                style={{ float: "right" }}
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedOption("");
                  setSelectedAddOns([]);
                  setHideGoalSection(!hideGoalSection);
                }}
              >
                View All / Change Category
              </button>
              <h5>
                Select A Category : <br />
                <span style={{ color: "#347791" }}>{selectedGoal}</span>
              </h5>
            </div>
            <div style={{ display: hideGoalSection ? "none" : "" }}>
              <h5 style={{ marginTop: "30px" }}>Select A Category :</h5>
              <div className="row">
                {goals.map((goal, index) => (
                  <div
                    key={index}
                    className="col-lg-3"
                    style={{ marginBottom: "15px" }}
                  >
                    <label
                      className="card cardGoal text-center p-3"
                      data-tooltip-id={`tooltip-${index}`}
                      data-tooltip-content={goal.Desc}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={goal.id}
                        onChange={() => setSelectedGoal(goal.text)}
                        checked={selectedGoal === goal.text}
                      />
                      <div className="icon-container">
                        <span style={{ fontSize: "30px" }}>{goal.emoji}</span>
                      </div>
                      <p className="title">{goal.text}</p>
                    </label>
                    <Tooltip id={`tooltip-${index}`} style={{ zIndex: 9999 }} />
                  </div>
                ))}
              </div>
            </div>

            {selectedGoal && goalOptions[selectedGoal] && (
              <div className="mt-3">
                <h5>Choose A Service:</h5>

                {/* Show all services if none selected */}
                {!selectedOption &&
                  goalOptions[selectedGoal].map((option: any, idx: any) => (
                    <div key={idx} className="form-check gapping">
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`option${idx}`}
                        name="goalOption"
                        value={option.text}
                        checked={selectedOption === option.text}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                          // console.log(
                          //   "targetValue",
                          //   e.target.value,
                          //   e.target.value
                          // );
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option${idx}`}
                      >
                        <p className="mb-0">
                          <strong>{option.text}</strong>
                        </p>
                        <p className="mb-0">{option.description}</p>
                      </label>
                    </div>
                  ))}

                {/* Show only selected service + add-ons + change button */}
                {selectedOption &&
                  goalOptions[selectedGoal]
                    .filter((option: any) => option.text === selectedOption)
                    .map((option: any, idx: any) => (
                      <div key={idx} className="form-check gapping">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`option${idx}`}
                          name="goalOption"
                          value={option.text}
                          checked
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`option${idx}`}
                        >
                          <p className="mb-0">
                            <strong>{option.text}</strong>
                          </p>
                          <p className="mb-0">{option.description}</p>
                        </label>

                        {addOnOptions[selectedOption] && (
                          <div className="mt-3">
                            <h5>Add-Ons for {selectedOption}</h5>
                            {addOnOptions[selectedOption].map(
                              (addOn: any, index: any) => (
                                <div key={index} className="form-check gapping">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`addon${index}`}
                                    checked={selectedAddOns.includes(
                                      addOn.text
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAddOns([
                                          ...selectedAddOns,
                                          addOn.text,
                                        ]);
                                      } else {
                                        setSelectedAddOns(
                                          selectedAddOns.filter(
                                            (item) => item !== addOn.text
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`addon${index}`}
                                  >
                                    <p className="mb-0">
                                      <strong>{addOn.text}</strong>
                                    </p>
                                    <p className="mb-0">{addOn.description}</p>
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedOption("");
                              setSelectedAddOns([]);
                            }}
                          >
                            View / Change Service
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            )}

            <div className="container mt-4">
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    selectedGoal,
                    mainServices,
                    subServices,
                    selectedOption
                  )
                }
              >
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="Name"
                      className="form-control"
                      placeholder="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="Email"
                      className="form-control"
                      placeholder="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="PhoneNum"
                      className="form-control"
                      value={formData.PhoneNum}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Country *</label>
                    <select
                      name="country"
                      className="form-select"
                      value={formData.country}
                      onChange={handleChange}
                      style={{ width: "100%", height: "60px" }}
                      required
                    >
                      <option value="">-- Select --</option>
                      {countries.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      How did you hear about us
                    </label>
                    <select
                      name="HearAbt"
                      className="form-select"
                      value={formData.HearAbt}
                      onChange={handleChange}
                      style={{ width: "100%", height: "60px" }}
                      required
                    >
                      <option value="">-- Select --</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="OfficialSite">Official Site</option>
                      <option value="Whatsapp">Whatsapp</option>
                      <option value="fb">Facebook</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Major Subject Type *</label>
                    <select
                      name="majorSubject"
                      className="form-select"
                      value={formData.majorSubject}
                      onChange={handleChange}
                      style={{ width: "100%", height: "60px" }}
                      required
                    >
                      <option value="">-- Select --</option>
                      {subjectsData.map((subject) => (
                        <optgroup key={subject.id} label={subject.subject}>
                          {subject.sub_subjects.map((subSubject) => (
                            <option key={subSubject.id} value={subSubject.id}>
                              {subSubject.sub_name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {/* <select
                      value={selectedSubSubject}
                      onChange={(e) => setSelectedSubSubject(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select a subject/sub-subject</option>
                      {subjectsData.map((subject) => (
                        <optgroup key={subject.id} label={subject.subject}>
                          {subject.sub_subjects.map((subSubject) => (
                            <option key={subSubject.id} value={subSubject.id}>
                              {subSubject.sub_name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select> */}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Specific Subject Area *
                    </label>
                    <textarea
                      name="specificSubject"
                      className="form-control"
                      placeholder="Enter ..."
                      value={formData.specificSubject}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Delivery Date *</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      className="form-control"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Preferred Language *</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="preferredLanguage"
                        value="American English"
                        checked={
                          formData.preferredLanguage === "American English"
                        }
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label">
                        American English
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="preferredLanguage"
                        value="British English"
                        checked={
                          formData.preferredLanguage === "British English"
                        }
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        British English
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Instruction for Editor</label>
                  <textarea
                    name="editorInstruction"
                    className="form-control"
                    placeholder="Enter ..."
                    value={formData.editorInstruction}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    name="paymentMode"
                    className="form-select"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    style={{ width: "100%", height: "60px" }}
                    required
                  >
                    <option value="">--Select payment mode--</option>
                    <option value="credit">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="debit">Debit Card</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#A1D0FF",
                  }}
                >
                  <input
                    type="checkbox"
                    id="terms"
                    onChange={handleCheckboxChange}
                    checked={isChecked}
                    onClick={() => setIsChecked(!isChecked)}
                  />
                  <label
                    htmlFor="terms"
                    style={{ fontSize: "12px", textAlign: "left" }}
                  >
                    &nbsp;&nbsp;* I have read and agreed to your{" "}
                    <Link href="https://manuscriptedit.com/Service-Agreement/">
                      Service Agreement
                    </Link>{" "}
                    and{" "}
                    <Link href="https://manuscriptedit.com/TermsOfService/">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="https://manuscriptedit.com/PrivacyPolicy/">
                      Privacy Policy
                    </Link>
                    , and to receive important communications electronically
                    from you
                  </label>

                  {/* Modal */}
                  {showModal && (
                    <div
                      className="modal show"
                      tabIndex={-1}
                      role="dialog"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div
                            className="modal-header"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* <h5 className="modal-title">Modal title</h5> */}
                            {/* <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span style={{fontSize:'2rem'}}>&times;</span>
                </button> */}
                          </div>
                          <SignUpAgreement />
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={disAgreed}
                              id="disAgreed"
                            >
                              Disagree
                            </button>
                            <button
                              style={{ marginBottom: "0" }}
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                setShowModal(false);
                                setIsChecked(true);
                                setIsChecked2(true);
                              }}
                            >
                              Agree
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    marginTop: "0rem",
                    marginBottom: "1rem",
                    padding: "1rem",
                    paddingTop: "0",
                    backgroundColor: "#A1D0FF",
                  }}
                >
                  <input
                    type="checkbox"
                    id="newsLetter"
                    checked={isChecked2}
                    onClick={() => setIsChecked2(!isChecked2)}
                  />
                  <label
                    htmlFor="newsLetter"
                    style={{ fontSize: "12px", textAlign: "left" }}
                  >
                    &nbsp;I want to subscribe Manuscriptedit newsletter.
                  </label>
                </div>

                <div className="mb-3 d-flex">
                  <img src={captchaImage.src} alt="captcha" />
                  <input
                    type="text"
                    placeholder="Enter Captcha"
                    value={captchaName}
                    onChange={(e) => {
                      setCaptchaName(e.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit & Register
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="summary-container">
            <div className="card border rounded shadow-sm p-3 card_holderHeight scrollable-summary">
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2">Summary</h5>
                <p className="mb-2">
                  <strong>Category :</strong>
                  <br></br> {selectedGoal}
                </p>
                <div className="mb-3">
                  <strong>Service:</strong>
                  <p className="d-flex justify-content-between align-items-center border p-2 rounded mt-2">
                    <span>{selectedOption || "None"}</span>
                    {(selectedGoal === "Editing & Language Services" ||
                      selectedGoal === "Manuscriptedit Packages") &&
                      (optionTotalPrice !== 0 ? (
                        <span className="fw-bold">
                          $
                          {selectedOption
                            ? goalOptions[selectedGoal]?.find(
                                (opt: any) => opt.text === selectedOption
                              )?.price || totalPrice.toFixed(2)
                            : "0"}
                        </span>
                      ) : (
                        ""
                      ))}
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Selected Add-Ons:</strong>
                  {selectedGoal != "Editing & Language Services" &&
                  selectedAddOns.length > 0 &&
                  addOnOptions[selectedOption] ? (
                    <table className="table table-sm table-borderless mt-2">
                      <tbody>
                        {addOnOptions[selectedOption]
                          .filter((addOn: any) =>
                            selectedAddOns.includes(addOn.text)
                          )
                          .map((addOn: any, index: any) => (
                            <tr key={index}>
                              <td>{addOn.text}</td>
                              <td className="text-end fw-bold">
                                {addOn.price > 0 ? (
                                  `₹${addOn.price}`
                                ) : (
                                  <h6 className="TableQuote"></h6>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <></>
                  )}

                  {selectedGoal === "Editing & Language Services" &&
                  selectedAddOns.length > 0 ? (
                    <div className="pt-3">
                      <table className="table table-sm table-borderless mt-2">
                        <tbody>
                          {addonturnaroundPrice
                            .filter((addOn) =>
                              selectedAddOns.includes(addOn.name)
                            )
                            .map((addOn, index) => {
                              const isPerWord = addOn.price < 1;
                              const calculatedPrice = isPerWord
                                ? addOn.price * wordCount
                                : addOn.price;

                              return (
                                <tr key={index}>
                                  <td className="fw-bold">{addOn.name}</td>
                                  <td className="text-end fw-bold">
                                    ${calculatedPrice.toFixed(2)}
                                    {isPerWord && (
                                      <span className="text-muted"> </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {selectedGoal === "Editing & Language Services" ||
                  selectedGoal === "Manuscriptedit Packages" ? (
                    optionTotalPrice != 0 ? (
                      <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Total:</h5>
                        <p className="fw-bold fs-5 text-primary mb-0">
                          ${optionTotalPrice.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                        <p className="mb-0">
                          Please enter word count for pricing.
                        </p>
                      </div>
                    )
                  ) : (
                    selectedGoal && (
                      <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                        <p className="mb-0">
                          For the selected service, pricing depends on
                          data/manuscript's complexity
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
