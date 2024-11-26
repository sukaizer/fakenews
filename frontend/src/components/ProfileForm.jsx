import React, { useState } from 'react';
import api from "../api";
import { set, useForm } from 'react-hook-form';
import "../styles/ProfileForm.css";
import { getNames } from 'country-list';

const ProfileForm = ({ setProfile, setContent }) => {
    // Initialize useForm hook
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [isConsent, setIsConsent] = useState(false);

    const countries = getNames();

    const genders = [
        "Male",
        "Female",
        "Non-binary",
    ];

    // Watch selected values
    const selectedGender = watch('gender');
    const selectedCitizenship = watch('citizenship');
    const selectedPolitical = watch('political_orientation');
    const selectedReligion = watch('religion');
    const selectedEthnicity = watch('ethnicity');

    const handleFormSubmit = (data) => {
        if (selectedGender === 'Other') {
            data.gender = data.otherGender;
        }
        if (selectedCitizenship === 'Other') {
            data.citizenship = data.otherCitizenship;
        }
        if (selectedPolitical === 'Other') {
            data.political_orientation = data.otherPolitical;
        }
        if (selectedReligion === 'Other') {
            data.religion = data.otherReligion;
        }
        if (selectedEthnicity === 'Other') {
            data.ethnicity = data.otherEthnicity;
        }


        if (selectedCitizenship === 'Multiple') {
            data.citizenship = data.multipleCitizenship;
        }
        if (selectedEthnicity === 'Multiple') {
            data.ethnicity = data.multipleEthnicity;
        }

        let profile = {
            age: data.age,
            gender: data.gender,
            country_of_residence: data.country_of_residence,
            citizenship: data.citizenship,
            political_orientation: data.political_orientation,
            religion: data.religion,
            ethnicity: data.ethnicity
        };
        
        setProfile(profile);
        setContent("experiment");
    };

    // Generate age options
    const ageOptions = [];
    for (let i = 18; i <= 99; i++) {
        ageOptions.push(i);
    }

    return (
        <div className="profile-form-container">
            {!isConsent && (
                <div>
                    <p>Thank you for your interest in participating in this study. Please read the following information carefully. By proceeding with the study, you confirm that you understand the study details and consent to participate. Your participation is entirely voluntary.</p>

                    <h2>Purpose of the Study</h2>
                    <p>This study aims to understand how people respond to social media posts. By collecting anonymous responses, we hope to gain insights into social media engagement patterns.</p>

                    <h2>What to Expect</h2>
                    <p>After answering a few questions about yourself, you will view 8 social media posts. You will be asked to respond to each post as you would on another social media platform (e.g. X, Instagram, Facebook, etc). After responding to the posts, you will be asked what you thought about them. It will take around 10-20 minutes to complete the study.</p>

                    <h2>Anonymity and Confidentiality</h2>
                    <p>This study does not collect any personally identifying information, such as names, emails, or device identifiers. All responses are anonymous and cannot be traced back to individual participants. The data collected will be used exclusively for research purposes and may be shared in research publications or presentations in an aggregated, anonymous format.</p>

                    <h2>Voluntary Participation</h2>
                    <p>Your participation is completely voluntary. You may exit the study at any time by closing the study webpage.</p>

                    <h2>Contact Information</h2>
                    <p>If you have any questions about this study, please contact Prof. Eli Gottlieb at <strong>egottlieb@gwu.edu</strong></p>

                    <p>By selecting “I Consent” below, you confirm that you:</p>
                    <ul>
                        <li>Are at least <strong>18</strong> years old.</li>
                        <li>Understand that participation is voluntary and that you can stop at any time.</li>
                        <li>Consent to participate in this study under the terms described above.</li>
                    </ul>
                    <button className="profile-form-button" onClick={() => setIsConsent(true)}>I consent</button>
                </div>
            )}
            
            {isConsent && (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="profile-form" defaultValue="">
                    <div>
                        <label className="profile-form-label">
                            Age:
                            <select {...register('age', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                                <option disabled value="">Select Age</option>
                                {ageOptions.map(age => (
                                    <option key={age} value={age}>{age}</option>
                                ))}
                            </select>
                        </label>
                        {errors.age && <span className="profile-form-error">{errors.age.message}</span>}
                    </div>
                <div>
                    <label className="profile-form-label">
                        Gender:
                        <select {...register('gender', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                            <option disabled value="">Select Gender</option>
                            {genders.map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                            ))}
                            <option value="Other">Other</option>
                            <option value="PNTS">Prefer not to specify</option>
                        </select>
                    </label>
                    {selectedGender === 'Other' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('otherGender', { required: 'Field is required' })}
                            />
                        )}
                    {errors.gender && <span className="profile-form-error">{errors.gender.message}</span>}
                    {errors.otherGender && <span className="profile-form-error">{errors.otherGender.message}</span>}
                </div>
                <div>
                    <label className="profile-form-label">
                        Country of Residence:
                        <select {...register('country_of_residence', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                            <option disabled value="">Select Country of Residence</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                             ))}
                            <option value="PNTS">Prefer not to specify</option>
                        </select>
                    </label>
                    {errors.country && <span className="profile-form-error">{errors.country.message}</span>}
                </div>
                    <div>
                        <label className="profile-form-label">
                            Citizenship:
                            <select {...register('citizenship', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                                <option disabled value="">Select Citizenship</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="India">India</option>
                                <option value="Multiple">Multiple citizenships</option>
                                <option value="Other">Other</option>
                                <option value="PNTS">Prefer not to specify</option>
                            </select>
                        </label>
                        {selectedCitizenship === 'Other' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('otherCitizenship', { required: 'Field is required' })}
                            />
                        )}
                        {selectedCitizenship === 'Multiple' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('multipleCitizenship', { required: 'Field is required' })}
                            />
                        )}
                        {errors.citizenship && <span className="profile-form-error">{errors.citizenship.message}</span>}
                        {errors.otherCitizenship && <span className="profile-form-error">{errors.otherCitizenship.message}</span>}
                        {errors.multipleCitizenship && <span className="profile-form-error">{errors.multipleCitizenship.message}</span>}
                    </div>
                    <div>
                        <label className="profile-form-label">
                            Political Orientation:
                            <select {...register('political_orientation', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                                <option disabled value="">Select Political Orientation</option>
                                <option value="Liberal">Liberal</option>
                                <option value="Conservative">Conservative</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Other">Other</option>
                                <option value="PNTS">Prefer not to specify</option>
                            </select>
                        </label>
                        {selectedPolitical === 'Other' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('otherPolitical', { required: 'Field is required' })}
                            />
                        )}
                        {errors.political_orientation && <span className="profile-form-error">{errors.political_orientation.message}</span>}
                        {errors.otherPolitical && <span className="profile-form-error">{errors.otherPolitical.message}</span>}
                    </div>
                    <div>
                        <label className="profile-form-label">
                            Religion:
                            <select {...register('religion', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                                <option disabled value="">Select Religion</option>
                                <option value="Christian">Christian</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Jewish">Jewish</option>
                                <option value="None">No religion</option>
                                <option value="Other">Other</option>
                                <option value="PNTS">Prefer not to specify</option>
                            </select>
                        </label>
                        {selectedReligion === 'Other' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('otherReligion', { required: 'Field is required' })}
                            />
                        )}
                        {errors.religion && <span className="profile-form-error">{errors.religion.message}</span>}
                        {errors.otherReligion && <span className="profile-form-error">{errors.otherReligion.message}</span>}
                    </div>
                    <div>
                        <label className="profile-form-label">
                            Ethnicity:
                            <select {...register('ethnicity', { required: 'Field is required' })} className="profile-form-input" defaultValue="">
                                <option disabled value="">Select Ethnicity</option>
                                <option value="Asian">Asian</option>
                                <option value="Black">Black</option>
                                <option value="Hispanic">Hispanic</option>
                                <option value="White">White</option>
                                <option value="Multiple">Multiracial</option>
                                <option value="Other">Other</option>
                                <option value="PNTS">Prefer not to specify</option>
                            </select>
                        </label>
                        {selectedEthnicity === 'Other' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('otherEthnicity', { required: 'Field is required' })}
                            />
                        )}
                        {selectedEthnicity === 'Multiple' && (
                            <input
                                type="text"
                                className="profile-form-input"
                                placeholder="Please specify"
                                {...register('multipleEthnicity', { required: 'Field is required' })}
                            />
                        )}
                        {errors.ethnicity && <span className="profile-form-error">{errors.ethnicity.message}</span>}
                        {errors.otherEthnicity && <span className="profile-form-error">{errors.otherEthnicity.message}</span>}
                        {errors.multipleEthnicity && <span className="profile-form-error">{errors.multipleEthnicity.message}</span>}
                    </div>
                <button type="submit" className="profile-form-button">Submit</button>
            </form>
            )}
        </div>
    );
};

export default ProfileForm;