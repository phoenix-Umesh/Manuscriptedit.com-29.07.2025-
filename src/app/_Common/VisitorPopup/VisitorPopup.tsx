"use client";
import { useEffect, useRef, useState } from "react";
import "./VisitorPopup.css";

declare global {
  interface Window {
    bootstrap: any;
  }
}

const VisitorPopup = ({
  onSubmit,
  onClose,
}: {
  onSubmit?: () => void;
  onClose?: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission status

  const [countries, setCountries] = useState([]);



  console.log("Cont:", countries);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const formData = {
      name: form.name.value,
      email: form.email.value,
      phone_no: form.phone_no.value,
      country: form.country_code.value,
      message: form.message.value,
      hear_about: form.hear_about.value,
    };

    console.log("formData", formData);

    try {
      const response = await fetch(
        "https://secure.manuscriptedit.com/api/visitors_leads.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(
          "Thank you for connecting with us! Your confirmation email is on its way to your inbox."
        );
        form.reset();
        form.classList.remove("was-validated");

        // Close the modal after submission
        const modalEl = document.getElementById("contactModal");
        if (modalEl) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }

        // Mark the form as submitted
        setIsSubmitted(true);

        // Inform parent that form was submitted
        onSubmit?.();
      } else {
        alert(
          `Submission failed: ${result.message || "Please try again later."}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleClose = () => {
    // When the modal is manually closed, trigger the onClose callback
    if (onClose) onClose();
    setIsSubmitted(false); // Reset submission status
  };

  useEffect(() => {
    // Initialize the Bootstrap modal
    const modalEl = modalRef.current;

    if (modalEl) {
      const modalInstance = new window.bootstrap.Modal(modalEl);

      // Event listener for when the modal is shown
      const showModal = () => {
        console.log("Modal shown");
      };

      // Event listener for when the modal is hidden
      const hideModal = () => {
        console.log("Modal hidden");
        handleClose(); // Handle close when modal is hidden
      };

      modalEl.addEventListener("shown.bs.modal", showModal);
      modalEl.addEventListener("hidden.bs.modal", hideModal);

      // Cleanup event listeners on unmount
      return () => {
        modalEl.removeEventListener("shown.bs.modal", showModal);
        modalEl.removeEventListener("hidden.bs.modal", hideModal);
      };
    }
  }, []);

  useEffect(() => {
    // If form has already been submitted, prevent modal from opening again
    if (isSubmitted) {
      const modalEl = document.getElementById("contactModal");
      if (modalEl) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }
    }
  }, [isSubmitted]);

  useEffect(() => {
    fetch("https://secure.manuscriptedit.com/api/get_all_country_list.php")
      .then((res) => res.json())
      .then((data) => {
        // Assuming the API returns an array like [{ name, code, dial_code }, ...]
        setCountries(data);
      })
      .catch((err) => console.error("Failed to load country list:", err));
  }, []);

  return (
    <div
      className="modal fade"
      id="contactModal"
      tabIndex={-1}
      aria-labelledby="contactModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded">
          <div
            className="modal-header text-white"
            style={{ background: "#070361" }}
          >
            <h6 className="modal-title" id="contactModalLabel">
              Get A Free Consultation
            </h6>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose} // Close the modal manually via button
            ></button>
          </div>
          <form noValidate onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-1">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                />
                <div className="invalid-feedback">Please enter your name.</div>
              </div>

              <div className="mb-1">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  required
                />
                <div className="invalid-feedback">
                  Please enter a valid email.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phone_no" className="form-label">
                  Phone <span className="text-danger">*</span>
                </label>

                <div className="d-flex">
                  {/* Country Code Dropdown */}
                  <select
                    id="country_code"
                    name="country_code"
                    className="form-select me-2"
                    style={{ maxWidth: "150px" }}
                    required
                  >
                    <option value="">Country</option>
                    {countries.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.country}
                      </option>
                    ))}
                  </select>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    className="form-control p-3"
                    id="phone_no"
                    name="phone_no"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="invalid-feedback">
                  Please enter your phone number.
                </div>
              </div>

              <div className="mb-1">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows={1}
                />
              </div>

              <div className="mb-1">
                <label htmlFor="hear_about" className="form-label">
                  Meanwhile, how did you hear about us? We&#39;re curious :)
                </label>
                <select
                  className="form-select"
                  id="hear_about"
                  name="hear_about"
                >
                  <option value="">Select an option</option>
                  <option value="Google">Google Search</option>
                  <option value="Word of Mouth">Word of Mouth</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Online Advertisement">
                    Online Advertisement
                  </option>
                  <option value="Email Newsletter">Email Newsletter</option>
                  <option value="Blog or Article">Blog or Article</option>
                  <option value="Event or Webinar">Event or Webinar</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose} // Handle close manually
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorPopup;
