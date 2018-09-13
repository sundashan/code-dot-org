import React from 'react';
import LabeledFormComponent from "../../form_components/LabeledFormComponent";
import {
  PageLabels,
  SectionHeaders,
  TextFields
} from '@cdo/apps/generated/pd/teacher1920ApplicationConstants';
import {isEmail, isZipCode} from '@cdo/apps/util/formatValidation';
import {
  FormGroup
} from 'react-bootstrap';
import {styles} from './TeacherApplicationConstants';

export default class Section2YourSchool extends LabeledFormComponent {
  static labels = PageLabels.section2YourSchool;

  static associatedFields = [
    ...Object.keys(PageLabels.section2YourSchool),
    "currentRole_other",
    "gradesTeaching_notTeachingExplanation",
    "gradesTeaching_other",
    "gradesExpectToTeach_notExpectingToTeachExplanation",
    "gradesExpectToTeach_other",
    "subjectsTeaching_other",
    "subjectsExpectToTeach_other",
    "subjectsLicensedToTeach_other",
    "taughtInPast_other",
    "csOfferedAtSchool_other",
    "csOpportunitiesAtSchool_other"
  ];

  /**
   * @override
   */
  handleChange(newState) {
    if (newState.school || newState.schoolState || newState.schoolZipCode) {
      // School info changed? Clear page 4 partner and workshop mapping
      newState.ableToAttendSingle = undefined;
      newState.ableToAttendMultiple = undefined;
      newState.alternateWorkshops = undefined;
    }

    super.handleChange(newState);
  }

  handleSchoolChange = selectedSchool => {
    this.handleChange({school: selectedSchool && selectedSchool.value});
  };

  render() {
    return (
      <FormGroup>
        <h3>Section 2: {SectionHeaders.section2YourSchool}</h3>



        {this.checkBoxesFor("gradesAtSchool")}

        {this.checkBoxesWithAdditionalTextFieldsFor("gradesTeaching", {
          [TextFields.notTeachingThisYear] : "notTeachingExplanation",
          [TextFields.otherPleaseExplain] : "other"
        })}

        {this.checkBoxesWithAdditionalTextFieldsFor("gradesExpectToTeach", {
          [TextFields.notTeachingNextYear] : "notExpectingToTeachExplanation",
          [TextFields.otherPleaseExplain] : "other"
        })}

        {this.checkBoxesWithAdditionalTextFieldsFor("subjectsTeaching", {
          [TextFields.otherPleaseList] : "other"
        })}

        {this.checkBoxesWithAdditionalTextFieldsFor("subjectsExpectToTeach", {
          [TextFields.otherPleaseList] : "other"
        })}

        <p style={styles.formText}>
          Requirements for licensing, certifications, and endorsements to teach computer science vary widely
          across the country. Please answer the following questions to the best of your knowledge, so that
          your Regional Partner can ensure that teachers selected for this program will be able to teach the
          course in the coming school year.
        </p>
        <p style={styles.formText}>
          Note: Code.org does not require specific licenses to teach these courses, but to participate in this
          program, you must be able to teach this course during the 2019-20 school year.
        </p>

        {this.radioButtonsFor("doesSchoolRequireCsLicense")}
        {this.props.data.doesSchoolRequireCsLicense && this.props.data.doesSchoolRequireCsLicense === 'Yes' &&
          <div style={styles.indented}>
            {this.inputFor("whatLicenseRequired")}
          </div>
        }

        {this.radioButtonsFor("haveCsLicense")}

        {this.checkBoxesWithAdditionalTextFieldsFor("subjectsLicensedToTeach", {
          [TextFields.otherPleaseList] : "other"
        })}

        {this.checkBoxesWithAdditionalTextFieldsFor("taughtInPast", {
          [TextFields.otherPleaseList] : "other"
        })}

        {this.checkBoxesFor("previousYearlongCdoPd")}

        {this.checkBoxesWithAdditionalTextFieldsFor("csOfferedAtSchool", {
          [TextFields.otherPleaseList] : "other"
        })}

        {this.checkBoxesWithAdditionalTextFieldsFor("csOpportunitiesAtSchool", {
          [TextFields.otherWithText] : "other"
        })}

      </FormGroup>
    );
  }

  /**
   * @override
   */
  static getDynamicallyRequiredFields(data) {
    const requiredFields = [];

    if (data.doesSchoolRequireCsLicense === 'Yes') {
      requiredFields.push(
        "whatLicenseRequired"
      );
    }

    if (data.school && data.school === '-1') {
      requiredFields.push(
        "schoolName",
        "schoolDistrictName",
        "schoolAddress",
        "schoolCity",
        "schoolState",
        "schoolZipCode",
        "schoolType"
      );
    }

    return requiredFields;
  }

  /**
   * @override
   */
  static getErrorMessages(data) {
    const formatErrors = {};

    if (data.school && data.school === '-1' && data.schoolZipCode && !isZipCode(data.schoolZipCode)) {
      formatErrors.schoolZipCode = "Must be a valid zip code";
    }

    if (data.principalEmail) {
      if (!isEmail(data.principalEmail)) {
        formatErrors.principalEmail = "Must be a valid email address";
      }
      if (data.principalConfirmEmail && data.principalEmail !== data.principalConfirmEmail) {
        formatErrors.principalConfirmEmail = "Must match the principal email";
      }
    }

    return formatErrors;
  }

  /**
   * @override
   */
  static processPageData(data) {
    const changes = {};

    if (data.school && data.school !== '-1') {
      changes.schoolName = undefined;
      changes.schoolDistrictName = undefined;
      changes.schoolAddress = undefined;
      changes.schoolCity = undefined;
      changes.schoolState = undefined;
      changes.schoolZipCode = undefined;
      changes.schoolType = undefined;
    }

    if (data.doesSchoolRequireCsLicense !== 'Yes') {
      changes.whatLicenseRequired = undefined;
    }

    return changes;
  }
}
