/**
 * 최소 8자 이상의 길이.
 * 영어 대문자, 소문자, 숫자, 특수 문자 중 최소 하나 이상의 문자를 포함.
 */
const pwRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,16}$/;
const emailRegex = /^[A-Za-z0-9]{1,64}@inha\.edu$/;

module.exports = {
    pwRegex,
    nameRegex,
    emailRegex
}
