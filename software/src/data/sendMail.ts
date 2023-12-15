import emailjs from "@emailjs/browser";
import { EMAIL_PUBLIC, EMAIL_SERVICE, EMAIL_TEMPLATE } from "@env";

type templateParams = {
  pin: string;
  email: string;
};

const SERVICE_KEY = EMAIL_SERVICE;
const TEMPLATE_KEY = EMAIL_TEMPLATE;
const PUBLIC_KEY = EMAIL_PUBLIC;

const sendmail = async (params: templateParams) => {
  const template = {
    email: params.email,
    pin: params.pin,
  };
  emailjs.send(SERVICE_KEY, TEMPLATE_KEY, template, PUBLIC_KEY).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
};

export default sendmail;

