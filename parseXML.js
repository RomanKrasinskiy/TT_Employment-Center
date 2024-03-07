export function parseXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const vacancies = [];

  const vacancyElements = xmlDoc.getElementsByTagName("vacancy");
  for (let i = 0; i < vacancyElements.length; i++) {
    const vacancyElement = vacancyElements[i];
    const jobName = vacancyElement.querySelector("job-name").textContent;
    const description = vacancyElement.querySelector("description").textContent;
    const url = vacancyElement.querySelector("url").textContent;
    const industry = vacancyElement.querySelector("industry").textContent;
    const salary = vacancyElement.querySelector("salary").textContent;
    const currency = vacancyElement.querySelector("currency").textContent;
    const schedule = vacancyElement.querySelector("schedule").textContent;
    const requirementElement = vacancyElement.querySelector("requirement");
    const education = requirementElement.querySelector("education").textContent;
    const experience = requirementElement.querySelector("experience").textContent;
    const region = vacancyElement.querySelector("region").textContent;
    const addressElement = vacancyElement.querySelector("address");
    const location = addressElement.querySelector("location").textContent;
    const metroElements = addressElement.querySelectorAll("metro");
    const metros = Array.from(metroElements).map(metro => metro.textContent);
    // const coordinatesElement = addressElement.querySelector("coordinates");
    // const x = coordinatesElement.querySelector("x").textContent;
    // const y = coordinatesElement.querySelector("y").textContent;
    const creationDate = vacancyElement.querySelector("creation-date").textContent;
    const publishDate = vacancyElement.querySelector("publish-date").textContent;
    const realPublishDate = vacancyElement.querySelector("real-publish-date").textContent;
    const updateDate = vacancyElement.querySelector("update-date").textContent;
    const expires = vacancyElement.querySelector("expires").textContent;
    const companyElement = vacancyElement.querySelector("company");
    const companyName = companyElement.querySelector("name").textContent;
    const companyDescription = companyElement.querySelector("description").textContent;
    const inn = companyElement.querySelector("inn").textContent;
    const isHRAgency = companyElement.querySelector("hr-agency").textContent === "true";

    vacancies.push({
      jobName,
      description,
      url,
      industry,
      salary,
      currency,
      schedule,
      requirement: {
        education,
        experience
      },
      region,
      address: {
        location,
        metros,
        // coordinates: {
        //   x,
        //   y
        // }
      },
      creationDate,
      publishDate,
      realPublishDate,
      updateDate,
      expires,
      company: {
        companyName,
        companyDescription,
        inn,
        isHRAgency
      }
    });
  }
  // console.log(vacancies);
  return vacancies;
}
