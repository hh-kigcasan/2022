class FormValidation
{
    constructor()
    {
        this.errors = [];
    }

    // Description: Multiple validations based on callback.
    // Required Parameters: fieldName, data
    // Optional Parameters: callbacks after the 'data'parameter. It should be in this format '[callback.bind({Object Instance})]'
    // Optional Parameters: additional param with the callback. Example '[callback.bind({Object Instance}, data2]'. Applicable only to methods with extra parameter
    // Return: true or false
    // Example: multipleValidation('First Name', 'goku', [isNotEmpty.bind({Object Instance}], [isMinCharacters.bind({Object Instance}, 2], [isAlpha.bind({Object Instance}]);
    multipleValidation(fieldName, data)
    {
        let result;
        
        for (let i = 2; i < arguments.length; i++)
        {
            // arguments[i][0] is the callback function, while arguments[i][1] is the additional data/argument of the callback function
            result = arguments[i][0](fieldName, data, arguments[i][1]);

            if (!result)
            {
                return false;
            }
        }

        return true;
    }

    // returns true if the data is not empty, otherwise returns false
    isNotEmpty(fieldName, data)
    {
        if (!data)
        {
            this.errors.push(`${fieldName} field should not be empty.`);
            return false;
        }

        return true;
    }

    // returns true if the data is more than or equal to min, otherwise returns false
    isMinCharacters(fieldName, data, min)
    {
        if (min > data.length)
        {
            this.errors.push(`${fieldName} field's total characters should be greater than or equal to ${min}.`);
            return false;
        }

        return true;
    }

    // returns true if the data is purely alphabetical characters, otherwise returns false
    isAlpha(fieldName, data)
    {
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].toUpperCase() == data[i].toLowerCase())
            {
                this.errors.push(`${fieldName} field should contain alphabetical characters only.`);
                return false;
            }

            return true;
        }
    }

    // returns true if the data is not equal to any data in dataArr, otherwise returns false
    isUnique(fieldName, data, dataArr)
    {
        for (let i = 0; i < dataArr.length; i++)
        {
            if (data == dataArr[i])
            {
                this.errors.push(`${fieldName} field should be unique.`);
                return false;
            }

            return true;
        }
    }

    // returns true if the data1 is the same as data2, otherwise returns false
    isMatch(fieldName, data1, data2)
    {
        if (data1 !== data2)
        {
            this.errors.push(`${fieldName} did not match.`);
            return false;
        }

        return true;
    }

    // returns true if the data is numeric, otherwise returns false
    isNumeric(fieldName, data)
    {
        if (data / 1 != data)
        {
            this.errors.push(`${fieldName} must be numeric.`);
            return false;
        }

        return true;
    }

    // returns true if the data is integer, otherwise returns false
    isInteger(fieldName, data)
    {
        if (data % 1 != 0)
        {
            this.errors.push(`${fieldName} must be an integer (whole number).`);
            return false;
        }

        return true;
    }

    // returns true if the data is greater than min, otherwise returns false
    isGreaterThan(fieldName, data, min)
    {
        if (data <= min)
        {
            this.errors.push(`${fieldName} must be an greater than ${min}.`);
            return false;
        }

        return true;
    }

    // returns true if the data is greater than or equal to min, otherwise returns false
    isGreaterThanOrEqualTo(fieldName, data, min)
    {
        if (data < min)
        {
            this.errors.push(`${fieldName} must be an greater than or equal to ${min}.`);
            return false;
        }

        return true;
    }

    // returns true if the dataArr is in the list or empty, otherwise returns false
    isInListOrEmpty(fieldName, dataArr, list)
    {
        let counter = 0;

        if (!dataArr)
        {
            return true;
        }

        for (let i = 0; i < dataArr.length; i++)
        {
            for (let j = 0; j < list.length; j++) 
            {
                if (dataArr[i] == list[j])
                {
                    break;
                }
                counter++;
            }

            if (counter == list.length) 
            {
                this.errors.push(`${fieldName} not in list.`);
                return false;
            }
        }

        return true;
    }

    // returns true if the email is valid, otherwise returns false
    isValidEmail(fieldName, email)
    {
        const validCharsLocal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.";
        const validCharsDomainName = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
        const validCharsTopLevelDomain = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let emailArr = email.split('@') ? email.split('@') : [];
        let localPart = emailArr[0];
        let domainPart;
        let domainName;

        // return false if the length is not equal to 2 after the split of email at '@' symbol.
        // return false if there are invalid character at first and last position of local part.
        if ((emailArr.length != 2) || (localPart[0] == '.' || localPart[localPart.length - 1] == '.'))
        {
            this.errors.push(`${fieldName} field should be a valid email address.`);
            return false;
        }

        domainPart = emailArr[1].split('.');
        domainName = domainPart[0];
        
        // return false if the length is less than 2 after the split of domain at '.' symbol.
        // return false if there are invalid character at first and last position of domain name.
        // return false if the top-level domain is all numeric characters.
        if ((domainPart.length < 2) || (domainName[0] == '-' || domainName[domainName.length - 1] == '-') || (!isNaN(domainPart[1])))
        {
            this.errors.push(`${fieldName} field should be a valid email address.`);
            return false;
        }

        // loop through the domain name to check if the characters are valid, return false if not.
        for (let i = 0; i < domainName.length; i++)
        {
            let charIndex;

            for (charIndex = 0; charIndex < validCharsDomainName.length; charIndex++)
            {
                if (domainName[i] == validCharsDomainName[charIndex])
                {
                    break;
                }
            }

            if (charIndex == validCharsDomainName.length)
            {
                this.errors.push(`${fieldName} field should be a valid email address.`);
                return false;
            }
        }

        // loop through the top level domain to check if the characters are valid, return false if not.
        for (let i = 0; i < domainPart[1].length; i++)
        {
            let charIndex;

            for (charIndex = 0; charIndex < validCharsTopLevelDomain.length; charIndex++)
            {
                if (domainPart[1][i] == validCharsTopLevelDomain[charIndex])
                {
                    break;
                }
            }

            if (charIndex == validCharsTopLevelDomain.length)
            {
                this.errors.push(`${fieldName} field should be a valid email address.`);
                return false;
            }
        }

        // loop through the local part to check if the characters are valid, return false if not.
        for (let i = 0; i < localPart.length; i++)
        {
            let charIndex;

            if (localPart[i - 1] == '.' && localPart[i] == '.')
            {
                this.errors.push(`${fieldName} field should be a valid email address.`);
                return false;
            }

            for (charIndex = 0; charIndex < validCharsLocal.length; charIndex++)
            {
                if (localPart[i] == validCharsLocal[charIndex])
                {
                    break;
                }
            }

            if (charIndex == validCharsLocal.length)
            {
                this.errors.push(`${fieldName} field should be a valid email address.`);
                return false;
            }
        }

        // domain in IP address literal format not considered in verification.
        // top-level domain country code is not included in verification.

        return true;
    }

    // this method consolidates all errors into one string with optional HTML tag.
    consolidateErrors(htmlTagOpen = '', htmlTagClose = '')
    {
        let str = '';

        for (let i = 0; i < this.errors.length; i++)
        {
            str += htmlTagOpen + this.errors[i] + htmlTagClose + ' \n';
        }

        return str;
    }
}

module.exports = new FormValidation();