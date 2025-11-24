import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./BusinessQuote.module.css";

const COMPLIANCE_OPTIONS = [
  "HIPAA",
  "GDPR",
  "PCI-DSS",
  "SOX",
  "CCPA",
  "ISO/IEC 27001",
  "Other",
];

type FormData = {
  companySize: string;
  industry: string;
  otherIndustry?: string;
  hasCompliance: string;
  complianceTypes?: string[];
  hasRemoteWorkforce: string;
  currentSolutions: string;
  budget: number;
  securityRequirements: string;
};

export default function BusinessQuote() {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      companySize: "",
      industry: "",
      hasCompliance: "",
      complianceTypes: [],
      hasRemoteWorkforce: "",
      budget: 1000,
    },
  });

  const hasCompliance = watch("hasCompliance");
  const industry = watch("industry");
  const complianceTypes = watch("complianceTypes");

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    navigate("/loading"); // show the loading animation

    // simulate backend processing
    setTimeout(() => {
      navigate("/report");
    }, 3000);
  };

  return (
    <div className={styles.pageWrapper}>
      <button className={styles.backBtn} onClick={() => navigate("/")}>
        ← Back
      </button>

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Business Security Quote</h1>
        <p className={styles.subtitle}>
          Fill out the form to receive a tailored enterprise-grade solution.
        </p>

        <div className={styles.field}>
          <label>Company Size</label>
          <select {...register("companySize")}>
            <option value="">Select your company size</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-1000">201–1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Industry</label>
          <select {...register("industry")}>
            <option value="">Select your industry</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Education">Education</option>
            <option value="Government">Government</option>
            <option value="Legal">Legal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {industry === "Other" && (
          <div className={styles.field}>
            <label>Please specify your industry</label>
            <input
              placeholder="e.g. Hospitality, Aviation..."
              {...register("otherIndustry")}
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Do you have specific compliance requirements?</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" value="yes" {...register("hasCompliance")} />
              Yes
            </label>
            <label>
              <input type="radio" value="no" {...register("hasCompliance")} />
              No
            </label>
            <label>
              <input
                type="radio"
                value="not-sure"
                {...register("hasCompliance")}
              />
              I'm not sure
            </label>
          </div>
        </div>

        {hasCompliance === "yes" && (
          <div className={styles.field}>
            <label>Select compliance frameworks:</label>
            <div className={styles.checkboxGrid}>
              {COMPLIANCE_OPTIONS.map((option) => (
                <label key={option} className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    value={option}
                    {...register("complianceTypes")}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {complianceTypes?.includes("Other") && (
              <input
                className={styles.input}
                placeholder="Please specify other"
                {...register("otherCompliance")}
              />
            )}
          </div>
        )}

        <div className={styles.field}>
          <label>Do you have remote or hybrid workforce?</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" value="yes" {...register("hasRemoteWorkforce")} />
              Yes, remote or hybrid
            </label>
            <label>
              <input type="radio" value="no" {...register("hasRemoteWorkforce")} />
              No, mostly in-office
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>Current Security Solutions (Optional)</label>
          <textarea
            placeholder="e.g. Cisco Firewall, Crowdstrike EDR..."
            {...register("currentSolutions")}
          />
        </div>

        <div className={styles.field}>
          <label>Estimated Monthly Budget (USD)</label>
          <input type="number" {...register("budget", { valueAsNumber: true })} />
        </div>

        <div className={styles.field}>
          <label>Any security concerns?</label>
          <textarea
            placeholder="e.g., Protect customer data, secure remote access..."
            {...register("securityRequirements")}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Get My Quote
        </button>
      </form>
    </div>
  );
}
