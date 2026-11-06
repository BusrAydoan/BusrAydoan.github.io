# Design Rationale: Zamansal Karnaval Poligonu

**Interactive Experience Link:** [https://busraydoan.github.io/ZamansalKARNAVAL/](https://busraydoan.github.io/ZamansalKARNAVAL/)

---

### Rationale

**1. Idea (60 words)**  
*Zamansal Karnaval Poligonu* is an interactive arcade shooting gallery where participants aim and fire paintballs at moving targets. Because projectile flight is not instantaneous, participants cannot rely solely on real-time hand-eye coordination. Instead, they must mentally project target trajectories into the future, transforming a standard arcade shooter into an engaging exercise of temporal calculation and spatial anticipation.

**2. Premise A and B (100 words)**  
The experience combines **Temporality** (Premise 04) and **Agency** (Premise 01)[cite: 5, 6]. Temporality is implemented through a strict 2.0-second flight delay (`delayMs: 2000`) on every projectile, creating a temporal gap between trigger pull and target impact. Agency is established through mouse-driven cannon rotation, instant shot initiation, and dynamic score updates. When three targets are hit, Agency overhauls the system state, triggering a celebratory grand plush bear prize overlay. These two premises create a direct tension: the user’s freedom to act (Agency) is governed by temporal lag (Temporality)[cite: 6].

**3. Theory (130 words)**  
Key concepts from academic literature informed our design decisions. First, **Wardrip-Fruin et al. (2009)** define agency as a relational phenomenon where player desires align with actions supported by the underlying computational model[cite: 1]. Our game challenges this by enforcing a 2.0-second delay, using feedback loops (such as temporal tracking rings) to help players transition from expecting immediate reflexes to mastering temporal rules. Second, while traditional HCI research like **Jota et al. (2013)** treats latency as an unwanted performance barrier to minimize, our project intentionally appropriates this concept as a positive mechanical constraint. Furthermore, **Gaver’s (1991)** affordances shaped our intuitive crosshair cursor, while **Norman’s (1988)** feedback principles guided our dynamic status indicators.

**4. What I Learned (60 words)**  
Initial user testing revealed that without visual trajectory cues, players felt disconnected from their shots during the 2.0-second wait. Adding an expanding temporal tracking ring on the target area bridged the gap between action and delayed consequence, confirming that minimal visual feedback is essential when manipulating time as a design material.

---

### References

* Gaver, W. W. (1991). Technology affordances. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '91)*, 79–84. https://doi.org/10.1145/108844.108856
* Jota, R., Ng, A., Dietz, P., & Wigdor, D. (2013). How fast is fast enough? A study of the effects of latency in direct-touch pointing tasks. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '13)*, 2291–2300. https://doi.org/10.1145/2470654.2481317
* Norman, D. A. (1988). *The Design of Everyday Things*. Doubleday.
* Wardrip-Fruin, N., Mateas, M., Dow, S., & Sali, S. (2009). Agency reconsidered. *Proceedings of the 2009 DiGRA International Conference*, 5(1). https://eis.ucsc.edu/papers/nwf-C7-digra09-agency.pdf