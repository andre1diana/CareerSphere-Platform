package project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.database.model.JobOffer;
import project.backend.database.repository.JobOfferRepository;
import org.springframework.transaction.annotation.Transactional;
import project.backend.database.repository.ApplicationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class JobOfferService {
    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;

    @Autowired
    public JobOfferService(JobOfferRepository jobOfferRepository, ApplicationRepository applicationRepository) {
        this.jobOfferRepository = jobOfferRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<JobOffer> getAllJobOffers() {
        List<JobOffer> jobs = (List<JobOffer>) jobOfferRepository.findAll();
        jobs.forEach(job -> {
            if (job.getCompanyId() != null) {
                job.getCompanyId().getCompanyName();
            }
        });
        return jobs;
    }

    public Optional<JobOffer> getJobOfferById(Long id) {
        return jobOfferRepository.findById(id);
    }

    public JobOffer save(JobOffer jobOffer) {
        return jobOfferRepository.save(jobOffer);
    }

    @Transactional
    public void deleteJobOffer(Long id) {
        // First delete all applications associated with this job offer
        applicationRepository.deleteByJobOfferId(id);
        // Then delete the job offer
        jobOfferRepository.deleteById(id);
    }
}
