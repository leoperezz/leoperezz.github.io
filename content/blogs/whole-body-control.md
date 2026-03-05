Much of the robotics ecosystem has focused specifically on manipulation-only tasks or mobile manipulation [[5]][[6]][[7]][[8]]. Several companies are also dedicated to building massive datasets for these systems—from data collection via UMIs [[4]], to companies like GenRobot [[9]], Sunday Robotics’ internal dataset with their custom UMI [[7]], and firms tracking more dexterous manipulation such as Build AI [[10]], Micro AGI [[11]], ManuData [[12]], among others—all of which are gathering large-scale data to train or pre-train these robots.

The idea of using purely human demonstrations as training data has long been one of the holy grails, because unlike traditional methods such as teleoperation via GELLO [[3]] or more sophisticated solutions like UMIs [[4]], it is more scalable. However, with the release of EgoScale [[2]], a significant advance has been shown: a recipe for leveraging such datasets effectively using little more than a single egocentric camera. Perhaps more striking is the finding that scaling laws hold when this data is used as pre-training for the robot.

![Scaling laws of EgoScale](https://res.cloudinary.com/dtpiuha91/image/upload/v1772676825/Screenshot_from_2026-03-04_21-12-26_xdttj7.png)

Yet why is there so little work on loco-manipulation? We have already seen videos of full-body policies, but most of these are designed for motion-reference RL or similar setups; they are not really exhibiting general intelligence. The most impressive result I have seen—although controlled and perhaps cherry‑picked—is Figure AI’s HELIX 02 system [[18]] and Atlas from Boston Dynamics [[19]]. This makes a lot of sense to me, because much of what humans do relies not only on dexterity in our hands, but also on the incredible coordination of our entire body. This is the final step needed to make these systems truly useful in the real world. It would literally unlock the technology required to automate **all kinds of physical jobs** that humans can do, and potentially even more.

However, as is clear for all systems based on deep learning, reaching this point will require three important ingredients:

* A lot of data / compute
* A good training recipe
* A good architecture

These are the three aspects we will focus on in this blog.

# Data

LLMs needed essentially all of the information on the internet (and more) to be trained [[13]], and this is great because it unlocked the scaling-law effects we have seen with transformer-based architectures [[14]]. However, the dimensionality we need for Embodied AI policies is much higher than what was required for LLMs. This makes sense: unlike LLMs, where we mainly need text and images (in something closer to a VQA setting), Embodied AI policies need all of that plus an understanding of environment dynamics (i.e., the transition function $\rho(s' \mid s, a)$), and we must align every timestep of those trajectories with the corresponding actions. To make things worse, we do not have a dataset anywhere near the scale of the internet.

## Attempts to scale data

As I mentioned earlier, attempts to scale data for robotics have so far focused mostly on bimanual arms, collected with UMIs (e.g., the [GEN‑0 system](https://generalistai.com/blog/nov-04-2025-GEN-0)) or egocentric manipulation datasets (e.g., [Egocentric‑100K](https://huggingface.co/datasets/builddotai/Egocentric-100K)). However, full-body datasets are still largely unexplored.

We should also ask what the optimal way to collect this data should be. There are some works inspired by bimanual robots, such as HUMI [[15]], which extends the original UMI idea to humanoids. HUMI basically uses IMUs to map the positions of the limbs and end-effectors, then reconstructs the body via inverse kinematics. However, there are two major drawbacks: first, it does not use dexterous hands, and second, collecting data still requires validating many things in real time (e.g., monitoring the robot’s pose while you collect demonstrations). While this is faster than pure teleoperation, it is still not as scalable as natural human experience.

![HUMI](https://res.cloudinary.com/dtpiuha91/image/upload/v1772723891/Screenshot_from_2026-03-05_09-39-27_tuvkvw.png)

Another recent and very interesting work is EgoHumanoid [[16]]. It is somewhat more scalable—though still not perfect—because data collection is more natural and scalable, but it tries to align human data into the robot space in a rather “hard‑coded” way. Its ideas are still valuable, especially how it explicitly tackles two key problems: **Action Alignment** (i.e., mapping human actions into the robot action space) and **View Alignment** (i.e., ensuring the robot’s observations lie within the distribution induced by its own morphology).

![EgoHumanoid](https://res.cloudinary.com/dtpiuha91/image/upload/v1772725250/Screenshot_from_2026-03-05_10-28-01_avktmd.png)

## Optimal device

From my perspective, if we want to scale data to something approaching internet scale, we need to collect it in a very natural way and through many different modalities. We must also think carefully about its distribution: some companies are using low‑cost factory setups to collect data cheaply, but they often do not consider the task distribution, long‑horizon behaviors, or whether the tasks are actually useful for having robots in our daily lives at home.

The idea should be to use a suit that can capture full‑body data, an egocentric camera, and wrist cameras (these have already become standard in most existing VLAs—though, as shown in [[17]], they are only useful for certain types of tasks). On top of that, I believe it is crucial to have gloves that continuously track hand poses, because relying solely on pose estimation is too imprecise. For complex objects and higher‑dexterity tasks, we need much better hand state estimation. Many tasks will also require that the hands are not always visible to the camera (e.g., lifting objects from below, carrying objects, picking up more items). This would also make it possible to incorporate tactile sensors, which we know are extremely important for manipulation, as we can see with HELIX 02 [[18]].

![Robonet](https://res.cloudinary.com/dtpiuha91/image/upload/v1772733914/unwatermarked_Gemini_Generated_Image_mc6hw9mc6hw9mc6h_eojvjv.png)


# Training Recipe

## Limitations of current whole‑body training

Designing a training recipe for full‑body policies is hard and still relatively unexplored. As I mentioned before, most of the ecosystem is focused only on manipulation, and the few works that do use the whole body are usually conditioned on a single, specific task (not general VLAs), such as motion‑reference RL [[20]] or more sophisticated full‑body loco‑manipulation setups where the policy is trained from multiple scripted episodes in simulation [[21]] [[22]]. These are all amazing works, but they are not really scalable to general‑purpose robots.

The closest approaches to what we actually want are EgoHumanoid [[16]] and WholeBodyVLA [[23]]. However, in both cases, to get a policy that “covers” the whole body, they mostly separate the manipulation and locomotion parts, where the latter is discretized into high‑level commands like forward, backward, left, and right. That design is not very efficient for most tasks.

On the other hand, the training recipe proposed by HELIX 02 [[18]] makes much more sense to me, because it addresses many of the reasons why other works either fail to generalize or end up constrained to very specific tasks. I think the key to having a VLA that can faithfully imitate humans is to introduce this **System 0**, which would play a role similar to our cerebellum.

What they do is something similar to motion‑reference RL so that the system not only learns to imitate human motion, but also learns to stabilize itself while doing so.

![HELIX 02](https://res.cloudinary.com/dtpiuha91/image/upload/v1772737935/Screenshot_from_2026-03-05_14-09-11_i3t2bb.png)

## An instinctive navigation–locomotion backbone

Because of that, I really think this is the right direction, but there are still a few things we need to validate. First, we need to see whether both System 0 and System 1 can actually scale; achieving something similar to EgoScale [[2]] in this setting would be amazing, but we still do not have a dataset that is large and diverse enough for these kinds of tasks. Second, navigation remains a major open point. Even if we decompose loco‑manipulation into more specific subtasks, navigation is still extremely important in these scenarios, because in a sense it is part of the policy itself.

In that direction, I think having a navigation system fused with a locomotion system, and that is highly adaptable, is a key path forward. I found a project that I think is incredible for this: Project Instinct [[24]]. It tackles a problem I have been thinking about a lot—the ability of humanoids (and humans) to instinctively perform diverse locomotion behaviors, such as stepping over obstacles, and so on. The question is: how can we integrate something like this as part of a general VLA?

My proposal would be to build an instinctive system similar in spirit to that project, but that has also learned to imitate humans. In other words, a much more capable, reactive, instinctive System 0 that can correct and refine the motions produced by System 1. Of course, that is only part of the problem; we also have other interesting aspects such as memory and planning, where progress is already more substantial than in this instinctive layer. Still, I think the only way to truly have robots for the next generation is to develop this instinctive system that allows robots to plan in real time and in a dexterous way—and the only source of information we can collect at massive scale to train it is human behavior.

## References

1. [Physical Intelligence, et al. *"$\pi$0.5: A Vision-Language-Action Model with Open-World Generalization".* arXiv preprint arXiv:2504.16054, 2025.](https://doi.org/10.48550/arXiv.2504.16054)
2. [Zheng, Ruijie, et al. *"EgoScale: Scaling Dexterous Manipulation with Diverse Egocentric Human Data".* arXiv preprint arXiv:2602.16710, 2026.](https://doi.org/10.48550/arXiv.2602.16710)
3. [Wu, Philipp, et al. *"GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework for Robot Manipulators".* arXiv preprint arXiv:2309.13037, 2023.](https://doi.org/10.48550/arXiv.2309.13037)
4. [Chi, Cheng, et al. *"Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots".* arXiv preprint arXiv:2402.10329, 2024.](https://doi.org/10.48550/arXiv.2402.10329)
5. [Weave Robotics.](https://www.weaverobotics.com/)
6. [Reflex Robotics.](https://www.reflexrobotics.com/)
7. [Sunday Robotics.](https://www.sunday.ai/)
8. [Physical Intelligence.](https://www.pi.website/)
9. [GenRobot – DAS (Data Acquisition System).](https://www.genrobot.ai/products/das)
10. [Build AI.](https://build.ai/)
11. [Micro AGI.](https://www.microagi.ai/)
12. [ManuData.](https://manudata.ai/)
13. [Brown, Tom B., et al. *"Language Models are Few-Shot Learners".* arXiv preprint arXiv:2005.14165, 2020.](https://doi.org/10.48550/arXiv.2005.14165)
14. [Kaplan, Jared, et al. *"Scaling Laws for Neural Language Models".* arXiv preprint arXiv:2001.08361, 2020.](https://doi.org/10.48550/arXiv.2001.08361)
15. [Nai, Ruiqian, et al. *"Humanoid Manipulation Interface: Humanoid Whole-Body Manipulation from Robot-Free Demonstrations".* arXiv preprint arXiv:2602.06643, 2026.](https://doi.org/10.48550/arXiv.2602.06643)
16. [Shi, Modi, et al. *"EgoHumanoid: Unlocking In-the-Wild Loco-Manipulation with Robot-Free Egocentric Demonstration".* arXiv preprint arXiv:2602.10106, 2026.](https://doi.org/10.48550/arXiv.2602.10106)
17. [Kareer, Simar, et al. *"Emergence of Human to Robot Transfer in Vision-Language-Action Models".* arXiv preprint arXiv:2512.22414, 2025.](https://doi.org/10.48550/arXiv.2512.22414)
18. [Figure AI – HELIX 02.](https://www.figure.ai/news/helix-02)
19. [Boston Dynamics – Atlas.](https://bostondynamics.com/products/atlas/)
20. [Wang, Yunshen, et al. *"OmniXtreme: Breaking the Generality Barrier in High-Dynamic Humanoid Control".* arXiv preprint arXiv:2602.23843, 2026.](https://arxiv.org/abs/2602.23843)
21. [He, Xialin, et al. *"ULTRA: Unified Multimodal Control for Autonomous Humanoid Whole-Body Loco-Manipulation".* arXiv preprint arXiv:2603.03279, 2026.](https://arxiv.org/abs/2603.03279)
22. [Xu, Sirui, et al. *"InterPrior: Scaling Generative Control for Physics-Based Human-Object Interactions".* arXiv preprint arXiv:2602.06035, 2026.](https://doi.org/10.48550/arXiv.2602.06035)
23. [Jiang, Haoran, et al. *"WholeBodyVLA: Towards Unified Latent VLA for Whole-Body Loco-Manipulation Control".* arXiv preprint arXiv:2512.11047, 2025.](https://doi.org/10.48550/arXiv.2512.11047)
24. [Project Instinct.](https://project-instinct.github.io/)