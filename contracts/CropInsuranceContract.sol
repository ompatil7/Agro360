// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropInsuranceContract {
    struct PolicyDetails {
    uint256 startDate;
    uint256 endDate;
    string policyName;
    string policyNumber;
    uint256 sumInsured;
    uint256 premium;
    }
    struct FarmDetails {
        uint256 areaSize;
        string irrigationType;
        uint256 radius;
        int256 latitude;
        int256 longitude;
    }

    struct FarmerDetails {
        string name;
        string email;
        string phone;
        string state;
        string district;
    }

    struct EnrollmentData {
        string status;
        string payment;
        uint256 enrollmentDate;
        PolicyDetails policy;
        FarmDetails farm;
        FarmerDetails farmer;
    }

    mapping(bytes32 => EnrollmentData) public enrollments;
    mapping(bytes32 => string[]) public cropCategories;

    event EnrollmentCreated(bytes32 indexed enrollmentHash);
    event CropCategoriesAdded(bytes32 indexed enrollmentHash);

    // IMPORTANT: Change "calldata" to "memory" in the struct parameters.
    function createEnrollment(
        bytes32 enrollmentHash,
        string memory status,
        string memory payment,
        uint256 enrollmentDate,
        PolicyDetails memory policy,
        FarmDetails memory farm,
        FarmerDetails memory farmer
    ) public {
        enrollments[enrollmentHash] = EnrollmentData({
            status: status,
            payment: payment,
            enrollmentDate: enrollmentDate,
            policy: policy,
            farm: farm,
            farmer: farmer
        });

        emit EnrollmentCreated(enrollmentHash);
    }

    function addCropCategories(bytes32 enrollmentHash, string[] calldata categories) public {
        cropCategories[enrollmentHash] = categories;
        emit CropCategoriesAdded(enrollmentHash);
    }
}