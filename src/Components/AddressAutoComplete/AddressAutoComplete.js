import React from "react";
import { TextField } from "@mui/material";
import Script from "react-load-script";

/**
 * Initializes Google Places Autocomplete for the provided input field.
 *
 * @param {HTMLInputElement} addressFieldElement - The input field element to attach autocomplete to.
 * @param {string[]} [allowedCountries=["US"]] - An array of country codes to allow. Use an empty array to allow all countries.
 * @param {boolean} [separatedAddress=false] - If `true`, the address will be returned as an object containing address, postalCode, city, country, and state separately. If `false`, it will only return an object with the address.
 * @param {Function} onChange - Callback function to handle input changes.
 */
const googleAddresses = (
  addressFieldElement,
  alowedCountries = ["US"],
  seperatedAddress = false,
  onChange
) => {
  const google = window.google;
  let autocomplete;
  const allowedCountry = alowedCountries;

  try {
    autocomplete = new google.maps.places.Autocomplete(addressFieldElement, {
      componentRestrictions: { country: allowedCountry },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });
  } catch (error) {
    console.log(error);
  }
  if (!autocomplete) {
    const val = document.getElementById("address_auto_complete");
    onChange({ address: val.value });
  }
  autocomplete?.addListener("place_changed", fillInAddress);
  function fillInAddress() {
    let address = "";
    let country = "";
    let city = "";
    let state = "";
    let postalCode = "";
    const place = autocomplete.getPlace();
    if (
      place &&
      place.address_components &&
      place.address_components.length >= 5
    ) {
      try {
        for (const component of place.address_components) {
          const componentType = component.types[0];
          const long_name = component.long_name;
          const short_name = component.short_name;
          if (long_name.toLocaleLowerCase().match("po box")) {
            onChange({
              error: "Cannot enter PO Box address",
            });
            break;
          }
          switch (componentType) {
            case "street_number": {
              address += `${long_name} `;
              break;
            }
            case "route": {
              address += `${long_name} `;
              break;
            }

            case "postal_code": {
              address += `${long_name} `;
              postalCode = `${long_name}${postalCode}`;
              break;
            }

            //some addresses don't have locality component.
            // so to get city we use postal town, but locality will be prioritized if present in components
            case "postal_town": {
              address += `${long_name}, `;
              city = long_name;
              break;
            }
            case "locality": {
              city = long_name;
              break;
            }

            case "administrative_area_level_2": {
              // ignored county name
              break;
            }

            case "administrative_area_level_1": {
              address += `${short_name}, `;
              if (city.length === 0) {
                city = short_name;
              }
              state = short_name;
              break;
            }

            case "country": {
              address += `${short_name} `;
              country = short_name;
              break;
            }
            default: {
              break;
            }
          }
        }

        if (!seperatedAddress) return onChange(address);
        onChange({ address, postalCode, city, state, country });
      } catch (error) {
        console.log(error);
      }
    } else {
      onChange({
        error: "Please enter valid address",
      });
    }
  }
};

/**
 * Clears previous autocomplete suggestions.
 *
 * @param {string} countryCode - The country code to filter suggestions.
 * @param {boolean} [separatedAddress=false] - If `true`, address is separated into parts.
 * @param {Function} onChange - Callback function to handle input changes.
 */
const changeHandler = (countryCode, seperatedAddress = false, onChange) => {
  try {
    const elements = [
      ...document?.getElementsByClassName("pac-container pac-logo"),
    ];
    if (elements?.length >= 2)
      elements
        ?.slice(0, elements.length - 1)
        ?.map((element) => element.remove());
  } catch (error) {
    console.log(error);
  }
  const element = document.getElementById("address_auto_complete");
  googleAddresses(element, countryCode, seperatedAddress, onChange);
};

/**
 * Initialize the Google Places Autocomplete with the provided options.
 *
 * @param {string}  google_api_key  [requiredParam]- The Google API key to be used to show suggestions.
 * @param {string[]} [allowedCountries=["US"]] [optionalParam]- An array of country codes to allow. Use an empty array to allow all countries.
 * @param {boolean} [separatedAddress=false] [optionalParam]- If `true`, the address will be returned as an object containing address, postalCode, city, country, and state separately. If `false`, it will only return an object with the address.
 * @param {Function} onChange [optionalParam]- Callback function to handle input changes.
 * @param {string} label [optionalParam]- Label for the input field.
 * @param {string} className [optionalParam]- CSS class name for styling.
 * @param {Object} styles [optionalParam]- CSS styles for customization.
 * @param {Function} onFocus [optionalParam]- Callback function when the input field is focused.
 * @param {Function} onBlur [optionalParam]- Callback function when the input field loses focus.
 * @param {string} defaultValue [optionalParam]- Default input value.
 * @param {string} value [optionalParam]- Input value.
 * @param {Object} ref [optionalParam]- Reference object for accessing the input element.
 * @param {boolean} disabled [optionalParam]- If `true`, the input is disabled.
 * @param {Function} onPaste [optionalParam]- Callback function for handling paste events.
 * @param {boolean} required [optionalParam]- If `true`, the input is required.
 */
const AddressAutoComplete = ({
  google_api_key,
  allowedCountries = ["US"],
  seperatedAddress = false,
  onChange,
  label,
  className,
  styles,
  onFocus,
  onBlur,
  defaultValue,
  value,
  ref,
  disabled,
  onPaste,
  required,
}) => {
  return (
    <>
      {google_api_key && (
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${google_api_key}&libraries=places`}
          onCreate={(e) => console.log(e, "value from on create")}
          onError={(e) => console.log(e, "value from on error")}
          onLoad={(e) => console.log(e, "value from on load")}
        />
      )}
      <TextField
        type="text"
        name="address-auto-complete"
        id="address_auto_complete"
        onChange={(e) => {
          if (google_api_key && google_api_key.length)
            changeHandler(allowedCountries, seperatedAddress, onChange);
          else {
            onChange({ address: e.target.value });
          }
        }}
        required={required}
        placeholder="Enter a Location"
        className={className}
        onFocus={onFocus}
        defaultValue={defaultValue}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
        onPaste={onPaste}
        style={styles ?? { minWidth: "400px", width: "400px" }}
        label={label}
        ref={ref}
      />
    </>
  );
};

export default AddressAutoComplete;
