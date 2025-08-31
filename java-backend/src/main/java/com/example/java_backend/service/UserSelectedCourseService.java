package com.example.java_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.java_backend.dto.course.UserSelectedCourseRequest;
import com.example.java_backend.model.Course;
import com.example.java_backend.model.User;
import com.example.java_backend.model.UserSelectedCourse;
import com.example.java_backend.repository.CourseRepository;
import com.example.java_backend.repository.UserRepository;
import com.example.java_backend.repository.UserSelectedCourseRepository;

@Service
public class UserSelectedCourseService {

    private final UserSelectedCourseRepository userSelectedCourseRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public UserSelectedCourseService(UserSelectedCourseRepository userSelectedCourseRepository,
                                     UserRepository userRepository,
                                     CourseRepository courseRepository) {
        this.userSelectedCourseRepository = userSelectedCourseRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    

   @Transactional
public UserSelectedCourse bookCourse(UserSelectedCourseRequest request) {
    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

    // Check if the user has already enrolled in this course
    boolean alreadyEnrolled = userSelectedCourseRepository
            .findByUserIdAndCourseId(user.getId(), course.getId())
            .isPresent();

    if (alreadyEnrolled) {
        throw new RuntimeException("User has already enrolled in this course");
    }

    UserSelectedCourse userSelectedCourse = new UserSelectedCourse();
    userSelectedCourse.setUser(user);
    userSelectedCourse.setCourse(course);
    userSelectedCourse.setCompletionStatus(request.getCompletionStatus());
    userSelectedCourse.setSelectedCourseTitle(
            request.getSelectedCourseTitle() != null ? request.getSelectedCourseTitle() : course.getTitle()
    );
    userSelectedCourse.setCertificateUrl(request.getCertificateUrl());
    userSelectedCourse.setEnrolledDate(request.getEnrolledDate());

    return userSelectedCourseRepository.save(userSelectedCourse);
}

// ✅ Unenroll user from a course
    @Transactional
    public boolean unenrollCourse(Long userId, Long courseId) {
        return userSelectedCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .map(enrollment -> {
                    userSelectedCourseRepository.delete(enrollment);
                    return true;
                })
                .orElse(false);
    }

}
